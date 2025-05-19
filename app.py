from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)
#model = "llama3.2:1b"  
model = "llama3.2:latest"

def chat(messages):
    r = requests.post(
        "http://127.0.0.1:11434/api/chat", 
        json={"model": model, "messages": messages, "stream": False},
    )
    r.raise_for_status()
    response = r.json()
    
    return response.get("message", {}).get("content", "")

# Page principale
@app.route("/")
def home():
    return render_template("index.html")

# Endpoint pour recevoir les ingrédients
@app.route("/ingredients", methods=["POST"])
def save_ingredients():
    data = request.json  # Récupérer les données JSON envoyées par le frontend
    user_input = f"Je vais te donner une liste d'ingrédients. À partir de cette liste, merci de me proposer entre\
                    3 et 5 recettes sous forme de liste à puces. Chaque recette doit inclure autant d'ingrédients \
                    de la liste que possible, mais il n'est pas nécessaire que tous les ingrédients soient utilisés\
                    dans chaque recette. Donne moi seulement les noms des recettes et également les ingrédients.\
                    Ne créer pas des recettes qui n'existent pas.Voici la liste d'ingrédients : {', '.join(data)}"
    message = [{"role": "user", "content": user_input}]
    response = chat(message)
    print(response)
    return response

if __name__ == "__main__":
    app.run(debug=True)
    
