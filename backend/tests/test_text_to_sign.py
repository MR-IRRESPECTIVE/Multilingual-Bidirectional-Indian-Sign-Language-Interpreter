import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.api.endpoints import text_translation_service

client = TestClient(app)
ENDPOINT = "/api/translate/text-to-sign"

def test_single_word_hello():
    response = client.post(ENDPOINT, json={"text": "hello"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["signs"]) == 1
    assert data["signs"][0]["id"] == "hello"
    assert data["signs"][0]["label"] == "HELLO"
    assert data["signs"][0]["video_url"] == ""

def test_thank_you_merge():
    """Test that THANK YOU is kept together"""
    response = client.post(ENDPOINT, json={"text": "Thank you"})
    assert response.status_code == 200
    data = response.json()
    assert len(data["signs"]) == 1
    assert data["signs"][0]["id"] == "thankyou"

def test_unsupported_word_fingerspell():
    """Test that unsupported words are in unsupported_words but upper case"""
    response = client.post(ENDPOINT, json={"text": "where is the hospital"})
    assert response.status_code == 200
    data = response.json()
    # 'IS' and 'THE' are stop words, so they are dropped.
    # 'WHERE' and 'HOSPITAL' are unsupported.
    assert len(data["signs"]) == 0
    assert "WHERE" in data["unsupported_words"]
    assert "HOSPITAL" in data["unsupported_words"]
    assert "WHERE" in data["gloss"]
    assert "HOSPITAL" in data["gloss"]

def test_grammar_sov_rearrangement():
    """Test basic pronoun verb object rearrangement: I WANT WATER -> I WATER WANT"""
    response = client.post(ENDPOINT, json={"text": "I want water"})
    assert response.status_code == 200
    data = response.json()
    gloss = data["gloss"]
    assert gloss == ["I", "WATER", "WANT"]

def test_empty_input():
    response = client.post(ENDPOINT, json={"text": ""})
    assert response.status_code == 422  # Handled by FastAPI validation or our code

def test_no_video_url_returned():
    response = client.post(ENDPOINT, json={"text": "hello"})
    assert response.status_code == 200
    data = response.json()
    assert all(sign["video_url"] == "" for sign in data["signs"])

def test_deduplication():
    """Test that consecutive identical words are deduplicated"""
    response = client.post(ENDPOINT, json={"text": "no no"})
    assert response.status_code == 200
    data = response.json()
    assert len(data["signs"]) == 1
    assert data["signs"][0]["id"] == "no"
