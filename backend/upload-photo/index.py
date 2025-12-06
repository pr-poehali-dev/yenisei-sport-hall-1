'''
Business: Загрузка фото в CDN и возврат постоянной ссылки
Args: event - dict с httpMethod, body (base64 картинка), headers
      context - object с request_id, function_name
Returns: HTTP response dict с постоянной URL-ссылкой на фото
'''
import json
import base64
import os
import requests
from typing import Dict, Any

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
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
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
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'No file data provided'})
            }
        
        if file_data.startswith('data:'):
            file_data = file_data.split(',', 1)[1]
        
        image_bytes = base64.b64decode(file_data)
        
        cdn_api_key = os.environ.get('CDN_API_KEY')
        project_id = os.environ.get('PROJECT_ID')
        
        cdn_response = requests.post(
            'https://cdn-api.poehali.dev/upload',
            headers={
                'Authorization': f'Bearer {cdn_api_key}',
                'X-Project-ID': project_id
            },
            files={
                'file': (filename, image_bytes, 'image/jpeg')
            }
        )
        
        if not cdn_response.ok:
            error_text = cdn_response.text
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': f'CDN upload failed: {error_text}'})
            }
        
        cdn_data = cdn_response.json()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'url': cdn_data.get('url'),
                'filename': filename
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }
