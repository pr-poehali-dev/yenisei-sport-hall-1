import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get feedback statistics and recent messages for admin panel
    Args: event with httpMethod
          context with request_id
    Returns: HTTP response with stats and messages list
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
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
        
        cur.execute("SELECT COUNT(*) FROM t_p40618121_yenisei_sport_hall_1.feedback_messages")
        total_count = cur.fetchone()[0]
        
        cur.execute("""
            SELECT name, email, message, created_at 
            FROM t_p40618121_yenisei_sport_hall_1.feedback_messages 
            ORDER BY created_at DESC 
            LIMIT 10
        """)
        messages = []
        for row in cur.fetchall():
            messages.append({
                'name': row[0],
                'email': row[1],
                'message': row[2],
                'created_at': row[3].isoformat() if row[3] else None
            })
        
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
                'total_count': total_count,
                'recent_messages': messages
            })
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
