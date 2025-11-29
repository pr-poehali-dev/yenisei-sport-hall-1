import json
import base64
import os
from typing import Dict, Any
from datetime import datetime
import psycopg2
import psycopg2.extras

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Upload PDF documents and store them in database
    Args: event - dict with httpMethod, body (JSON with base64 file)
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
            conn = psycopg2.connect(database_url)
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            
            cur.execute(
                "SELECT file_data, mime_type, uploaded_at FROM documents WHERE doc_type = %s ORDER BY uploaded_at DESC LIMIT 1",
                (doc_type,)
            )
            result = cur.fetchone()
            
            cur.close()
            conn.close()
            
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
                'body': base64.b64encode(bytes(result['file_data'])).decode('utf-8')
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
        try:
            body = event.get('body', '{}')
            data = json.loads(body)
            
            doc_type = data.get('docType')
            file_base64 = data.get('fileData')
            
            if not doc_type or not file_base64:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({'error': 'Missing docType or fileData'})
                }
            
            file_data = base64.b64decode(file_base64)
            
            database_url = os.environ.get('DATABASE_URL')
            
            conn = psycopg2.connect(database_url)
            cur = conn.cursor()
            
            cur.execute(
                "INSERT INTO documents (doc_type, file_data, mime_type, uploaded_at) VALUES (%s, %s, %s, %s)",
                (doc_type, psycopg2.Binary(file_data), 'application/pdf', datetime.utcnow())
            )
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'success': True, 'docType': doc_type})
            }
        except Exception as e:
            print(f"POST Error: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': str(e), 'type': type(e).__name__})
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }