import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Image
} from 'react-native';

export default function PestDetectionScreen({ navigation }: any) {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    setAnalysis('');
  };

  const analyzeImage = async () => {
    if (!imageFile) return;
    setLoading(true);
    setAnalysis('');
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('http://localhost:8081/api/pest/detect', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (e) {
      setAnalysis('Could not connect to server. Make sure the backend is running.');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pest Detection</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Take or upload a photo of your crop to identify pests and diseases
        </Text>

        <View style={styles.uploadBox}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderIcon}>📷</Text>
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
        </View>

        <View style={styles.uploadBtnContainer}>
          <input
            type="file"
            accept="image/*"
            onChange={pickImage}
            style={{
              backgroundColor: '#1a3d2b',
              color: '#fff',
              padding: 12,
              borderRadius: 10,
              width: '100%',
              cursor: 'pointer',
            }}
          />
        </View>

        {image && (
          <TouchableOpacity
            style={[styles.analyzeBtn, loading && styles.analyzeBtnDisabled]}
            onPress={analyzeImage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.analyzeBtnText}>Analyze Crop</Text>
            )}
          </TouchableOpacity>
        )}

        {loading && (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>
              AI is analyzing your crop image...
            </Text>
          </View>
        )}

        {analysis ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Analysis Result</Text>
            <Text style={styles.resultText}>{analysis}</Text>
            <TouchableOpacity
              style={styles.newAnalysisBtn}
              onPress={() => { setImage(null); setImageFile(null); setAnalysis(''); }}
            >
              <Text style={styles.newAnalysisBtnText}>Analyze Another Photo</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!image && !analysis && (
          <View style={styles.tipsBox}>
            <Text style={styles.tipsTitle}>Tips for best results:</Text>
            <Text style={styles.tip}>• Take photo in good lighting</Text>
            <Text style={styles.tip}>• Focus on the affected leaf or stem</Text>
            <Text style={styles.tip}>• Include both healthy and affected parts</Text>
            <Text style={styles.tip}>• Avoid blurry or dark photos</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f2d1f' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 50, backgroundColor: '#1a3d2b' },
  back: { color: '#4caf50', fontSize: 16, marginRight: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  content: { padding: 16 },
  subtitle: { color: '#888', fontSize: 14, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  uploadBox: { backgroundColor: '#1a3d2b', borderRadius: 16, height: 250, justifyContent: 'center', alignItems: 'center', marginBottom: 16, overflow: 'hidden' },
  previewImage: { width: '100%', height: 250, borderRadius: 16 },
  placeholder: { alignItems: 'center' },
  placeholderIcon: { fontSize: 64, marginBottom: 12 },
  placeholderText: { color: '#888', fontSize: 16 },
  uploadBtnContainer: { marginBottom: 16 },
  analyzeBtn: { backgroundColor: '#4caf50', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 },
  analyzeBtnDisabled: { backgroundColor: '#2e5e3e' },
  analyzeBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loadingBox: { backgroundColor: '#1a3d2b', borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center' },
  loadingText: { color: '#4caf50', fontSize: 14 },
  resultBox: { backgroundColor: '#1a3d2b', borderRadius: 16, padding: 16, marginBottom: 16 },
  resultTitle: { color: '#4caf50', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  resultText: { color: '#fff', fontSize: 14, lineHeight: 24 },
  newAnalysisBtn: { backgroundColor: '#0f2d1f', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 16 },
  newAnalysisBtnText: { color: '#4caf50', fontWeight: 'bold' },
  tipsBox: { backgroundColor: '#1a3d2b', borderRadius: 16, padding: 16 },
  tipsTitle: { color: '#4caf50', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  tip: { color: '#aaa', fontSize: 14, marginBottom: 8, lineHeight: 20 },
});