'''
Business: API для управления контентом сайта (контакты и виды спорта)
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с атрибутами request_id, function_name
Returns: HTTP response dict с данными контента
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            cur.execute('SELECT address, phone, email, hours FROM contacts ORDER BY id DESC LIMIT 1')
            contacts = cur.fetchone()
            
            cur.execute('SELECT id, name, image, video FROM sports ORDER BY display_order')
            sports_rows = cur.fetchall()
            
            sports = []
            for sport in sports_rows:
                cur.execute(
                    'SELECT rule_text FROM sport_rules WHERE sport_id = %s ORDER BY display_order',
                    (sport['id'],)
                )
                rules = [row['rule_text'] for row in cur.fetchall()]
                
                cur.execute(
                    'SELECT safety_text FROM sport_safety WHERE sport_id = %s ORDER BY display_order',
                    (sport['id'],)
                )
                safety = [row['safety_text'] for row in cur.fetchall()]
                
                sports.append({
                    'id': sport['id'],
                    'name': sport['name'],
                    'image': sport['image'],
                    'video': sport['video'],
                    'rules': rules,
                    'safety': safety
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({
                    'contacts': dict(contacts) if contacts else None,
                    'sports': sports
                })
            }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            update_type = body_data.get('type')
            
            if update_type == 'contacts':
                data = body_data.get('data', {})
                cur.execute(
                    'UPDATE contacts SET address = %s, phone = %s, email = %s, hours = %s, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM contacts ORDER BY id DESC LIMIT 1)',
                    (data.get('address'), data.get('phone'), data.get('email'), data.get('hours'))
                )
                conn.commit()
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'message': 'Контакты обновлены'})
                }
            
            if update_type == 'sports':
                sports_data = body_data.get('data', [])
                
                for sport in sports_data:
                    cur.execute(
                        'UPDATE sports SET name = %s, image = %s, video = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s',
                        (sport.get('name'), sport.get('image'), sport.get('video'), sport.get('id'))
                    )
                    
                    cur.execute('SELECT id FROM sport_rules WHERE sport_id = %s ORDER BY display_order', (sport['id'],))
                    existing_rules = cur.fetchall()
                    
                    for idx, rule in enumerate(sport.get('rules', [])):
                        if idx < len(existing_rules):
                            cur.execute(
                                'UPDATE sport_rules SET rule_text = %s WHERE id = %s',
                                (rule, existing_rules[idx]['id'])
                            )
                        else:
                            cur.execute(
                                'INSERT INTO sport_rules (sport_id, rule_text, display_order) VALUES (%s, %s, %s)',
                                (sport['id'], rule, idx + 1)
                            )
                    
                    cur.execute('SELECT id FROM sport_safety WHERE sport_id = %s ORDER BY display_order', (sport['id'],))
                    existing_safety = cur.fetchall()
                    
                    for idx, safety_item in enumerate(sport.get('safety', [])):
                        if idx < len(existing_safety):
                            cur.execute(
                                'UPDATE sport_safety SET safety_text = %s WHERE id = %s',
                                (safety_item, existing_safety[idx]['id'])
                            )
                        else:
                            cur.execute(
                                'INSERT INTO sport_safety (sport_id, safety_text, display_order) VALUES (%s, %s, %s)',
                                (sport['id'], safety_item, idx + 1)
                            )
                
                conn.commit()
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'message': 'Виды спорта обновлены'})
                }
        
        return {
            'statusCode': 405,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }