from flask import Flask, jsonify, request

from transformers import AutoTokenizer, BartForConditionalGeneration

model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")

app = Flask(__name__)

@app.route('/getSummary', methods=["POST"])
def getSummary():
    data = request.get_json(force=True)
    message = data['message']
    inputs = tokenizer([message], max_length=1024, return_tensors="pt")
    summary_ids = model.generate(inputs["input_ids"], num_beams=2, min_length=0, max_length=100)

    return jsonify({"summary": tokenizer.batch_decode(summary_ids, skip_special_tokens=True,
                                                      clean_up_tokenization_spaces=False)[0]})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)


