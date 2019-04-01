from flask import Flask, request, abort
import yaml

app = Flask(__name__)

users = "users.yml"


@app.route("/<api_key>/messaging-list", methods=["GET"])
def message_list(api_key):
    """ Returns the un-formatted messaging list"""
    with open(users, 'r') as file:
        data = yaml.safe_load(file)
    try:
        return tuple(data[api_key]["messaging-list"])
    except KeyError:  # gives back code 404 when api key not found
        abort(404)


@app.route("/<api_key>/message", methods=["POST"])
def post_message(api_key):
    """ Isolates variables and passes as inputs to a function"""
    try:
        content = request.get_json()
        type = content["type"]
        services = content["services"] if len(content["services"]) != 0 else ["slack", "email"]
        message = content["message"]
    except:
        abort(400)


@app.route("/<api_key>/add-recipients", methods=["POST"])
def add_recipients(api_key):
    """ Adds recipient to mailing list"""
    with open(users, 'r') as file:
        data = yaml.safe_load(file)
    try:
        content = request.get_json()
        new_recipients = content["recipients"]
        data[api_key]["messaging-list"].update(new_recipients)
        with open(users, 'w') as file:
            yaml.safe_dump(data, file)
    except KeyError:
        abort(404)
    except:
        abort(400)


@app.route("/<api_key>/delete-recipient/<id>", methods=["DELETE"])
def delete_recipient(api_key, id):
    """ Deletes recipient with id from yaml file"""
    with open(users, 'r') as file:
        data = yaml.safe_load(file)
    try:
        data[api_key]["messaging-list"].remove(id)
        with open(users, 'w') as file:
            yaml.safe_dump(data, file)
    except KeyError:
        abort(404)


if __name__ == '__main__':
    app.run(debug=True)
