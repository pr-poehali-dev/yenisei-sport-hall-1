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

def escape_sql_string(value):
    """Экранирование строк для Simple Query Protocol"""
    if value is None:
        return 'NULL'
    return "'" + str(value).replace("'", "''") + "'"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
            params = event.get('queryStringParameters', {})
            content_type = params.get('type', 'all') if params else 'all'
            
            if content_type == 'gallery':
                cur.execute('SELECT id, url, title, description, created_at FROM gallery_photos ORDER BY created_at DESC')
                photos = cur.fetchall()
                
                result = []
                for photo in photos:
                    result.append({
                        'id': str(photo['id']),
                        'url': photo['url'],
                        'title': photo['title'],
                        'description': photo['description']
                    })
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps(result)
                }
            
            cur.execute('SELECT address, phone, email, hours FROM contacts ORDER BY id DESC LIMIT 1')
            contacts = cur.fetchone()
            
            cur.execute('SELECT id, name, image, video FROM sports ORDER BY display_order')
            sports_rows = cur.fetchall()
            
            sports = []
            for sport in sports_rows:
                sport_id = escape_sql_string(sport['id'])
                cur.execute(f"SELECT rule_text FROM sport_rules WHERE sport_id = {sport_id} ORDER BY display_order")
                rules = [row['rule_text'] for row in cur.fetchall()]
                
                cur.execute(f"SELECT safety_text FROM sport_safety WHERE sport_id = {sport_id} ORDER BY display_order")
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
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            post_type = body_data.get('type')
            
            if post_type == 'gallery':
                data = body_data.get('data', {})
                url = escape_sql_string(data.get('url'))
                title = escape_sql_string(data.get('title'))
                description = escape_sql_string(data.get('description', ''))
                
                cur.execute(f"INSERT INTO gallery_photos (url, title, description) VALUES ({url}, {title}, {description}) RETURNING id")
                photo_id = cur.fetchone()['id']
                conn.commit()
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': True,
                        'id': str(photo_id),
                        'url': data.get('url'),
                        'title': data.get('title'),
                        'description': data.get('description', '')
                    })
                }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            update_type = body_data.get('type')
            
            if update_type == 'gallery':
                data = body_data.get('data', {})
                photo_id = int(data.get('id'))
                url = escape_sql_string(data.get('url'))
                title = escape_sql_string(data.get('title'))
                description = escape_sql_string(data.get('description', ''))
                
                cur.execute(f"UPDATE gallery_photos SET url = {url}, title = {title}, description = {description}, updated_at = CURRENT_TIMESTAMP WHERE id = {photo_id}")
                conn.commit()
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'message': 'Фото обновлено'})
                }
            
            if update_type == 'contacts':
                data = body_data.get('data', {})
                address = escape_sql_string(data.get('address'))
                phone = escape_sql_string(data.get('phone'))
                email = escape_sql_string(data.get('email'))
                hours = escape_sql_string(data.get('hours'))
                
                cur.execute(f"UPDATE contacts SET address = {address}, phone = {phone}, email = {email}, hours = {hours}, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM contacts ORDER BY id DESC LIMIT 1)")
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
                    sport_id = escape_sql_string(sport.get('id'))
                    name = escape_sql_string(sport.get('name'))
                    image = escape_sql_string(sport.get('image'))
                    video = escape_sql_string(sport.get('video'))
                    
                    cur.execute(f"UPDATE sports SET name = {name}, image = {image}, video = {video}, updated_at = CURRENT_TIMESTAMP WHERE id = {sport_id}")
                    
                    cur.execute(f"SELECT id FROM sport_rules WHERE sport_id = {sport_id} ORDER BY display_order")
                    existing_rules = cur.fetchall()
                    
                    for idx, rule in enumerate(sport.get('rules', [])):
                        rule_text = escape_sql_string(rule)
                        if idx < len(existing_rules):
                            rule_id = int(existing_rules[idx]['id'])
                            cur.execute(f"UPDATE sport_rules SET rule_text = {rule_text} WHERE id = {rule_id}")
                        else:
                            display_order = idx + 1
                            cur.execute(f"INSERT INTO sport_rules (sport_id, rule_text, display_order) VALUES ({sport_id}, {rule_text}, {display_order})")
                    
                    cur.execute(f"SELECT id FROM sport_safety WHERE sport_id = {sport_id} ORDER BY display_order")
                    existing_safety = cur.fetchall()
                    
                    for idx, safety_item in enumerate(sport.get('safety', [])):
                        safety_text = escape_sql_string(safety_item)
                        if idx < len(existing_safety):
                            safety_id = int(existing_safety[idx]['id'])
                            cur.execute(f"UPDATE sport_safety SET safety_text = {safety_text} WHERE id = {safety_id}")
                        else:
                            display_order = idx + 1
                            cur.execute(f"INSERT INTO sport_safety (sport_id, safety_text, display_order) VALUES ({sport_id}, {safety_text}, {display_order})")
                
                conn.commit()
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'message': 'Виды спорта обновлены'})
                }
        
        if method == 'DELETE':
            params = event.get('queryStringParameters', {})
            delete_type = params.get('type')
            
            if delete_type == 'gallery':
                photo_id = int(params.get('id', 0))
                cur.execute(f"DELETE FROM gallery_photos WHERE id = {photo_id}")
                conn.commit()
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'message': 'Фото удалено'})
                }
        
        cur.close()
        conn.close()
        
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