import json
import base64
import os
from typing import Dict, Any
from datetime import datetime
import psycopg
from psycopg.rows import dict_row

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Upload PDF documents and store them in database
    Args: event - dict with httpMethod, body (multipart form data)
          context - object with request_id, function_name attributes
    Returns: HTTP response with document URL
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        doc_type = event.get('queryStringParameters', {}).get('type')
        
        if not doc_type:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Missing type parameter'})
            }
        
        database_url = os.environ.get('DATABASE_URL')
        
        try:
            with psycopg.connect(database_url, row_factory=dict_row) as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "SELECT file_data, mime_type, uploaded_at FROM documents WHERE doc_type = %s ORDER BY uploaded_at DESC LIMIT 1",
                        (doc_type,)
                    )
                    result = cur.fetchone()
                    
                    if not result:
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type': 'application/json'
                            },
                            'body': json.dumps({'error': 'Document not found'})
                        }
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': result['mime_type'],
                            'Content-Disposition': f'inline; filename="{doc_type}.pdf"'
                        },
                        'isBase64Encoded': True,
                        'body': base64.b64encode(result['file_data']).decode('utf-8')
                    }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': str(e)})
            }
    
    if method == 'POST':
        body_raw = event.get('body', '')
        is_base64 = event.get('isBase64Encoded', False)
        
        if is_base64:
            body_bytes = base64.b64decode(body_raw)
        else:
            body_bytes = body_raw.encode('latin-1')
        
        content_type = event.get('headers', {}).get('content-type', '')
        
        if 'multipart/form-data' not in content_type:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Content-Type must be multipart/form-data'})
            }
        
        boundary = content_type.split('boundary=')[1].encode('latin-1')
        parts = body_bytes.split(b'--' + boundary)
        
        doc_type = None
        file_data = None
        
        for part in parts:
            try:
                if b'name="docType"' in part:
                    doc_type = part.split(b'\r\n\r\n')[1].split(b'\r\n')[0].decode('utf-8')
                elif b'name="file"' in part and b'filename=' in part:
                    file_data = part.split(b'\r\n\r\n', 1)[1].rsplit(b'\r\n', 1)[0]
            except:
                continue
        
        if not doc_type or not file_data:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Missing docType or file'})
            }
        
        database_url = os.environ.get('DATABASE_URL')
        
        try:
            with psycopg.connect(database_url) as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "INSERT INTO documents (doc_type, file_data, mime_type, uploaded_at) VALUES (%s, %s, %s, %s)",
                        (doc_type, file_data, 'application/pdf', datetime.utcnow())
                    )
                    conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'success': True, 'docType': doc_type})
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': str(e)})
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }