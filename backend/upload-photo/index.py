'''
Business: Upload photo file to CDN and return URL
Args: event - dict with httpMethod, body (base64 encoded image), headers
      context - object with request_id, function_name attributes
Returns: HTTP response dict with CDN URL
'''
import json
import base64
import uuid
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        file_data = body_data.get('file')
        filename = body_data.get('filename', 'photo.jpg')
        
        if not file_data:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'No file data provided'})
            }
        
        if ',' in file_data:
            file_data = file_data.split(',', 1)[1]
        
        file_bytes = base64.b64decode(file_data)
        
        ext = filename.split('.')[-1] if '.' in filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{ext}"
        
        cdn_api_key = os.environ.get('CDN_API_KEY', '')
        project_id = os.environ.get('PROJECT_ID', '')
        
        if not cdn_api_key or not project_id:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'CDN configuration missing'})
            }
        
        cdn_url = f'https://cdn.poehali.dev/upload'
        
        files = {
            'file': (unique_filename, file_bytes, 'image/jpeg')
        }
        
        headers = {
            'X-API-Key': cdn_api_key,
            'X-Project-ID': project_id
        }
        
        response = requests.post(cdn_url, files=files, headers=headers)
        
        if response.status_code != 200:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'CDN upload failed: {response.text}'})
            }
        
        cdn_response = response.json()
        file_url = cdn_response.get('url', '')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'url': file_url,
                'filename': unique_filename
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
