import { GoogleGenAI } from "@google/genai";
import { HistoriaClinicaContent, Patient, YesNoDetail } from './types';

const formatYesNo = (label: string, item: YesNoDetail): string => {
    if (item.value === 'Sí') {
        return `- ${label}: Sí. ${item.details ? `Detalles: ${item.details}` : ''}`;
    }
    if (item.value === 'No') {
        return `- ${label}: No.`;
    }
    return '';
};

const formatDataForPrompt = (patient: Patient, historyContent: HistoriaClinicaContent): string => {
    let prompt = `
# Resumen de Historia Clínica
A continuación se presenta la información detallada de un paciente geriátrico. Por favor, genera un resumen clínico conciso y bien estructurado en formato Markdown.

## Datos del Paciente
- Nombre: ${patient.nombre} ${patient.apellidos}
- Edad: Se calcula a partir de la fecha de nacimiento: ${patient.fechaNacimiento}
- Sexo: ${patient.sexo}

## Motivo de Consulta
- Motivo: ${historyContent.consultationReason.motivo}
- Desarrollo: ${historyContent.consultationReason.desarrollo}

## Antecedentes Personales Patológicos Relevantes
${[
    formatYesNo('Hipertensión Arterial', historyContent.antecedents.hipertension),
    formatYesNo('Diabetes Mellitus Tipo II', historyContent.antecedents.diabetesMellitus),
    formatYesNo('Alergias', historyContent.antecedents.alergias),
    formatYesNo('EPOC', historyContent.antecedents.epoc),
    formatYesNo('Transfusiones', historyContent.antecedents.transfusiones),
    formatYesNo('Cirugías', historyContent.antecedents.cirugias),
    historyContent.antecedents.otrosPatologicos ? `- Otros: ${historyContent.antecedents.otrosPatologicos}` : '',
].filter(Boolean).join('\n')}

## Hábitos Tóxicos
${[
    formatYesNo('Tabaco', historyContent.antecedents.tabaco),
    formatYesNo('Alcohol', historyContent.antecedents.alcohol),
    formatYesNo('Tisanas', historyContent.antecedents.tisanas),
    historyContent.antecedents.otrosToxicos ? `- Otros: ${historyContent.antecedents.otrosToxicos}` : '',
].filter(Boolean).join('\n')}

## Medicamentos Actuales
${historyContent.antecedents.medicamentos
    .filter(m => m.medicamento)
    .map(m => `- ${m.medicamento} - Dosis: ${m.dosis} - Tiempo de uso: ${m.tiempoUso}`)
    .join('\n') || 'Ninguno reportado.'}

## Revisión por Sistemas (Solo hallazgos positivos)
${Object.entries(historyContent.systemReview)
    .map(([key, value]) => {
        if (typeof value === 'object' && value !== null && 'value' in value) {
            const typedValue = value as YesNoDetail;
            if (typedValue.value === 'Sí') {
                return `- ${key}: Sí. ${typedValue.details ? `Detalles: ${typedValue.details}` : ''}`;
            }
        }
        return '';
    }).filter(Boolean).join('\n') || 'Sin hallazgos positivos reportados.'}
    
## Examen Físico (Solo hallazgos patológicos)
${Object.entries(historyContent.physicalExam.areas)
    .map(([key, value]) => {
        if ((value as { patologico: string }).patologico) {
            return `- ${key}: ${(value as { patologico: string }).patologico}`;
        }
        return '';
    }).filter(Boolean).join('\n') || 'Sin hallazgos patológicos reportados.'}

## Valoraciones Geriátricas Relevantes
${Object.entries(historyContent.valuations.geriatrico)
    .map(([key, value]) => {
        const typedValue = value as { presente: 'Sí' | 'No' | ''; intervencion: string };
        if (typedValue.presente === 'Sí') {
            return `- ${key}: Presente. Intervención: ${typedValue.intervencion || 'No especificada.'}`;
        }
        return '';
    }).filter(Boolean).join('\n') || 'Sin hallazgos positivos en la revisión de síndromes geriátricos.'}

Basado en esta información, por favor, elabore un resumen clínico profesional.
`;
    return prompt;
};


export const generateSummary = async (patient: Patient, historyContent: HistoriaClinicaContent): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API key for Gemini is not configured.");
    }
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = formatDataForPrompt(patient, historyContent);
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "Eres un asistente médico experto en geriatría. Tu tarea es analizar la información clínica de un paciente y generar un resumen claro, conciso y profesional en formato Markdown para facilitar la revisión del caso. Destaca los hallazgos más importantes."
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate summary from AI service.");
    }
};