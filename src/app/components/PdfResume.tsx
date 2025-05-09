// components/PdfResume.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 11, fontFamily: 'Helvetica' },
  section: { marginBottom: 10 },
  heading: { fontSize: 14, marginBottom: 4, fontWeight: 'bold' },
  text: { marginBottom: 2 },
});

const PdfResume = ({ resume }: { resume: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
    {resume && Object.entries(resume).map(([section, content]) => (
        

        <View key={section} style={styles.section}>
          <Text style={styles.heading}>{section.toUpperCase()}</Text>
          {Array.isArray(content)
            ? content.map((line: any, i: number) => (
                <Text key={i} style={styles.text}>
                  {
                    typeof line === 'object'
                      ? Object.entries(line)
                      .map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}: ${Array.isArray(v) ? v.join(', ') : v}`)
                      .join(' | ')
                      : String(line)}
                </Text>
              ))
              : content && typeof content === 'object' && !Array.isArray(content)
                ? Object.entries(content as Record<string, any>).map(([key, val]) => (

            
                <Text key={key} style={styles.text}>
                  {key}: {JSON.stringify(val)}
                </Text>
              ))
            : (
                <Text style={styles.text}>{String(content)}</Text>
              )}
        </View>
      ))}
    </Page>
  </Document>
);

export default PdfResume;
