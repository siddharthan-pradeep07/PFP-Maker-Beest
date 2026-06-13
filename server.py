from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json

app = Flask(__name__)
CORS(app)

def get_db():
    conn = sqlite3.connect('beest_pfp.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    db = get_db()
    db.execute('''
        CREATE TABLE IF NOT EXISTS reservations 
          (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            combination TEXT NOT NULL UNIQUE,
            reserved_by TEXT NOT NULL,
            pfp_name TEXT NOT NULL,
            reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
    ''')

    db.execute('''
        CREATE TABLE IF NOT EXISTS downloads 
          (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            combination TEXT NOT NULL UNIQUE,
            count INTEGER DEFAULT 1,
            last_downloaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
    ''')
    db.commit()
    db.close()

@app.route('/api/check_reservation', methods=['POST'])
def check_reservation():
    data = request.get_json()
    combination = json.dumps(data['combination'], sort_keys=True)

    db = get_db()

    row = db.execute(
        'SELECT reserved_by, pfp_name FROM reservations WHERE combination = ?',
        (combination,)
    ).fetchone()

    db.close()

    if row:
        return jsonify({
            'reserved': True,
            'reserved_by': row['reserved_by'],
            'pfp_name': row['pfp_name']
        })

    return jsonify({'reserved': False})

@app.route('/api/reserve', methods=['POST'])
def reserve():
    data = request.get_json()
    combination = json.dumps(data['combination'], sort_keys=True)
    reserved_by = data['reserved_by']
    pfp_name = data['pfp_name']
    db = get_db()
    existing = db.execute(
        'SELECT id FROM reservations WHERE combination = ?',
        (combination,)
    ).fetchone()
    if existing:
        db.close()
        return jsonify({'success': False})
    db.execute(
        'INSERT INTO reservations (combination, reserved_by, pfp_name) VALUES (?, ?, ?)',
        (combination, reserved_by, pfp_name)
    )
    db.commit()
    db.close()
    return jsonify({'success': True})  

@app.route('/api/unreserve', methods=['POST'])
def unreserve():
    data = request.get_json()
    combination = json.dumps(data['combination'], sort_keys=True)
    db = get_db()
    db.execute('DELETE FROM reservations WHERE combination = ?', (combination,))
    db.commit()
    db.close()
    return jsonify({ 'success': True })

@app.route('/')
def home():
    return "Server is running!"

@app.route('/api/my-reservation', methods=['POST'])
def my_reservation():
    data = request.get_json()
    reserved_by = data['reserved_by']
    db = get_db()
    row = db.execute(
        'SELECT combination, pfp_name FROM reservations WHERE reserved_by = ?',
        (reserved_by,)
    ).fetchone()
    db.close()
    if row:
        return jsonify({ 'found': True, 'combination': json.loads(row['combination']), 'pfp_name': row['pfp_name'] })
    return jsonify({'found': False})

@app.route('/api/download', methods=['POST'])
def log_download():
    data = request.get_json()
    combination = json.dumps(data['combination'], sort_keys=True)
    db = get_db()
    existing = db.execute(
        'SELECT id FROM downloads WHERE combination = ?',
        (combination,)
    ).fetchone()
    if existing:
        db.execute(
            'UPDATE downloads SET count = count + 1, last_downloaded = CURRENT_TIMESTAMP WHERE id = ?',
            (existing['id'],)
        )
    else:
        db.execute(
            'INSERT INTO downloads (combination) VALUES (?)', (combination,)
        )
    db.commit()
    db.close()
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    init_db()
    app.run(port=5000)