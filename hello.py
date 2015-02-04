import urllib
import pycurl
import json
from io import BytesIO
from flask import Flask, url_for, render_template, redirect, request

search_url = "https://q52gl5mw7d:k3u1ejwxrm@cs8803vda-search-clu-7980180164.us-east-1.bonsai.io"

app = Flask(__name__)

def search_by_term(term):
    response_buffer = BytesIO()
    c = pycurl.Curl()
    c.setopt(c.URL, search_url + "/documents/_search?q=" + term)
    c.setopt(c.WRITEDATA, response_buffer)
    c.perform()
    c.close()
    hits = []
    try:
        hits = json.loads(response_buffer.getvalue().decode("iso-8859-1"))["hits"]["hits"]
    except ValueError:
        pass
    return hits


@app.route("/")
def show_start():
    results = []
    return render_template('show_results.html', results=results)

@app.route("/<term>")
def show_results(term):
    hits = search_by_term(term)
    results = [dict(filename=i["_source"]["filename"], body=i["_source"]["body"]) for i in hits]
    return render_template('show_results.html', results=results)

@app.route("/search", methods=["POST"])
def search():
    print url_for("show_results", term=request.form["term"])
    return redirect(url_for("show_results", term=urllib.quote(request.form["term"])))

if __name__ == "__main__":
    app.debug = True
    app.run()
