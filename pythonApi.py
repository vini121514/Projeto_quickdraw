from flask import Flask, jsonify, abort
import json

app = Flask(__name__)

@app.route('/data', methods=['GET'])
def get_data():
    try:
        with open('answer.json', 'r') as file:
            data = json.load(file)
        return jsonify(data)
    except FileNotFoundError:
        abort(404, description="Arquivo answer.json não encontrado.")
    except json.JSONDecodeError:
        abort(500, description="Erro ao processar o arquivo JSON.")

if __name__ == '__main__':
    app.run(debug=True)
