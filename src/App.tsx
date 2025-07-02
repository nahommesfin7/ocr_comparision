// src/components/OCRWithPreprocessing.jsx
import React, { useState } from 'react';
import { Mistral } from '@mistralai/mistralai';
import Tesseract from 'tesseract.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Header } from './components/Header';
import { EngineSelector } from './components/EngineSelector';
import { CompareButton } from './components/CompareButton';
import { ImageUploader } from './components/ImageUploader';
import ImagePreview  from './components/ImagePreview';
import LoadingSpinner from './components/LoadingSpinner';
import ResultsDisplay from './components/ResultsDisplay';



export default function OCRWithPreprocessing() {
  // Update state to include both Gemini versions
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [ocrEngine, setOcrEngine] = useState<'mistral' | 'tesseract' | 'gemini-2.5' | 'gemini-1.5'>('mistral');
  const [bothOutputs, setBothOutputs] = useState(false);
  const [tesseractText, setTesseractText] = useState('');
  const [mistralText, setMistralText] = useState('');
  const [gemini25Text, setGemini25Text] = useState('');
  const [gemini15Text, setGemini15Text] = useState('');
  // Add new state for preprocessed image
  const [preprocessedImageUrl, setPreprocessedImageUrl] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
  const client = new Mistral({ apiKey });
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(geminiKey);

  const processWithMistral = async (preprocessedImage: string) => {
    const ocrResponse = await client.ocr.process({
      model: 'mistral-ocr-latest',
      document: {
        type: 'image_url',
        imageUrl: preprocessedImage,
      },
      includeImageBase64: true,
    });
    return ocrResponse.pages[0].markdown;
  };

  const processWithTesseract = async (preprocessedImage: string) => {
    const { data: { text } } = await Tesseract.recognize(
      preprocessedImage,
      'eng',
      { logger: (m) => console.log(m) }
    );
    return text;
  };

  // Add two separate Gemini processing functions
  const processWithGemini25 = async (preprocessedImage: string) => {
    try {
      const base64Image = preprocessedImage.split(',')[1];
      
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = "Extract and return all text visible in this image.";

      const result = await model.generateContent([
        {
          text: prompt
        },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image
          }
        }
      ]);

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini 2.5 processing error:', error);
      throw error;
    }
  };

  const processWithGemini15 = async (preprocessedImage: string) => {
    try {
      const base64Image = preprocessedImage.split(',')[1];
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = "Extract and return all text visible in this image.";

      const result = await model.generateContent([
        {
          text: prompt
        },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image
          }
        }
      ]);

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini 1.5 processing error:', error);
      throw error;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const originalImageURL = URL.createObjectURL(file);
    setImage(originalImageURL);
    setText('');
    setTesseractText('');
    setMistralText('');
    setGemini25Text('');
    setGemini15Text('');
    setLoading(true);

    try {
      const preprocessedImage = await preprocessImage(originalImageURL);
      setPreprocessedImageUrl(preprocessedImage); // Store preprocessed image URL
      
      if (bothOutputs) {
        // Process with all engines simultaneously
        const [mistralResult, tesseractResult, gemini25Result, gemini15Result] = await Promise.all([
          processWithMistral(preprocessedImage),
          processWithTesseract(preprocessedImage),
          processWithGemini25(preprocessedImage),
          processWithGemini15(preprocessedImage)
        ]);
        
        setMistralText(mistralResult);
        setTesseractText(tesseractResult);
        setGemini25Text(gemini25Result);
        setGemini15Text(gemini15Result);
      } else {
        // Process with selected engine only
        const result = await (
          ocrEngine === 'mistral' ? processWithMistral(preprocessedImage) :
          ocrEngine === 'tesseract' ? processWithTesseract(preprocessedImage) :
          ocrEngine === 'gemini-2.5' ? processWithGemini25(preprocessedImage) :
          processWithGemini15(preprocessedImage)
        );
        setText(result);
      }
    } catch (err) {
      console.error('OCR error:', err);
      setText('Error processing image');
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Canvas Preprocessing: Grayscale + Resize
  const preprocessImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // allow local blob URL
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = 2; // make image bigger for better OCR
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);

        // Convert to grayscale
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);

        resolve(canvas.toDataURL('image/png'));
      };
      img.src = src;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-8">
          <Header />
          <EngineSelector ocrEngine={ocrEngine} setOcrEngine={setOcrEngine} />
          <CompareButton bothOutputs={bothOutputs} setBothOutputs={setBothOutputs} />
          <ImageUploader onFileChange={handleFileChange} />
          
          <div className="space-y-6">
            <ImagePreview 
              image={image} 
              preprocessedImageUrl={preprocessedImageUrl} 
            />
            
            {loading && <LoadingSpinner />}

            <ResultsDisplay
              bothOutputs={bothOutputs}
              mistralText={mistralText}
              tesseractText={tesseractText}
              gemini25Text={gemini25Text}
              gemini15Text={gemini15Text}
              text={text}
              ocrEngine={ocrEngine}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
