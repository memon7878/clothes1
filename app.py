from flask import Flask, render_template, request

from flask import Flask, render_template

app = Flask(
    __name__,
    template_folder="jaywalking_clone/templates",
    static_folder="jaywalking_clone/static"
)
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/collection")
def collection():
    return render_template("collection.html")

@app.route("/lookbook")
def lookbook():
    return render_template("lookbook.html")

@app.route("/product")
def product():
    return render_template("product.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

@app.errorhandler(404)
def not_found(e):
    return render_template("index.html"), 404

if __name__ == "__main__":
    app.run(debug=True)
