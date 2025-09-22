from flask import Flask, jsonify, request, render_template
import uuid

app = Flask(__name__)

# In-memory storage for tasks
tasks = []

# Serve the main page
@app.route('/')
def index():
    return render_template('index.html')

# API endpoint to get all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

# API endpoint to add a new task
@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    task_text = data.get('text', '').strip()
    
    if not task_text:
        return jsonify({'error': 'Task text is required'}), 400
    
    # Create a new task with a unique ID
    new_task = {
        'id': str(uuid.uuid4()),
        'text': task_text
    }
    
    tasks.append(new_task)
    return jsonify(new_task), 201

# API endpoint to delete a task by ID
@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return jsonify({'message': 'Task deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)