import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage feedback messages - get list with filters, mark as read, archive/unarchive, delete
    Args: event with httpMethod, queryStringParameters (archived, id), body for updates
          context with request_id
    Returns: HTTP response with feedback data or operation result
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            show_archived = params.get('archived', 'false').lower() == 'true'
            
            cur.execute("""
                SELECT id, name, email, message, created_at, is_read, is_archived
                FROM t_p40618121_yenisei_sport_hall_1.feedback_messages 
                WHERE is_archived = %s
                ORDER BY created_at DESC
            """, (show_archived,))
            
            feedback_list = []
            for row in cur.fetchall():
                feedback_list.append({
                    'id': row[0],
                    'name': row[1],
                    'email': row[2],
                    'message': row[3],
                    'created_at': row[4].isoformat() if row[4] else None,
                    'is_read': row[5] if row[5] is not None else False,
                    'is_archived': row[6] if row[6] is not None else False
                })
            
            cur.execute("""
                SELECT 
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE NOT is_read) as unread,
                    COUNT(*) FILTER (WHERE is_archived) as archived
                FROM t_p40618121_yenisei_sport_hall_1.feedback_messages
            """)
            stats = cur.fetchone()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'feedback': feedback_list,
                    'total_count': stats[0],
                    'unread_count': stats[1],
                    'archived_count': stats[2]
                })
            }
        
        elif method == 'PUT':
            params = event.get('queryStringParameters', {}) or {}
            feedback_id = params.get('id')
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', 'mark_read')
            
            if not feedback_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Feedback ID required'})
                }
            
            if action == 'mark_read':
                cur.execute("""
                    UPDATE t_p40618121_yenisei_sport_hall_1.feedback_messages 
                    SET is_read = TRUE 
                    WHERE id = %s
                """, (feedback_id,))
            elif action == 'archive':
                cur.execute("""
                    UPDATE t_p40618121_yenisei_sport_hall_1.feedback_messages 
                    SET is_archived = TRUE 
                    WHERE id = %s
                """, (feedback_id,))
            elif action == 'unarchive':
                cur.execute("""
                    UPDATE t_p40618121_yenisei_sport_hall_1.feedback_messages 
                    SET is_archived = FALSE 
                    WHERE id = %s
                """, (feedback_id,))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Success'})
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {}) or {}
            feedback_id = params.get('id')
            
            if not feedback_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Feedback ID required'})
                }
            
            cur.execute("""
                DELETE FROM t_p40618121_yenisei_sport_hall_1.feedback_messages 
                WHERE id = %s
            """, (feedback_id,))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Deleted'})
            }
        
        else:
            cur.close()
            conn.close()
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }
