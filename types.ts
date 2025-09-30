export interface YesNoDetail {
    value: 'Sí' | 'No' | '';
    details: string;
}

export interface User {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    role: 'ADMIN' | 'MEDICO';
}

export interface Patient {
    id: number;
    nombre: string;
    apellidos: string;
    fechaNacimiento: string; 
    sexo: string;
    estadoCivil: string;
    direccion: string;
    telefono: string;
    numeroRecord: string;
    registroGeriatria: string;
}

export interface UniquePatient {
    ID_Paciente: number;
    Nombre: string;
    Apellidos: string;
    Numero_Record: string;
    Telefono: string;
    Total_Historias: number;
}


// FIX: Expanded PatientData to include a snapshot of patient details for each history entry.
export interface PatientData {
    fecha: string; // Date of the history entry
    informadoPor: string;
    informadoPorOtro: string;
    nombre: string;
    apellidos: string;
    edad: number | '';
    sexo: string;
    estadoCivil: string;
    direccion: string;
    telefono: string;
    numeroRecord: string;
    registroGeriatria: string;
}

export interface Medication {
    medicamento: string;
    dosis: string;
    tiempoUso: string;
    prescrito: string;
    noPrescrito: string;
}

export interface Antecedents {
    hipertension: YesNoDetail;
    diabetesMellitus: YesNoDetail;
    alergias: YesNoDetail;
    epoc: YesNoDetail;
    transfusiones: YesNoDetail;
    cirugias: YesNoDetail;
    otrosPatologicos: string;
    tabaco: YesNoDetail;
    alcohol: YesNoDetail;
    tisanas: YesNoDetail;
    otrosToxicos: string;
    medicamentos: Medication[];
    hipertensionFam: string;
    diabetesFam: string;
    tbpFam: string;
    cancerFam: string;
    enfermedadCardiacaFam: string;
    demenciasFam: string;
    otrosFam: string;
}

export interface ConsultationReason {
    motivo: string;
    desarrollo: string;
}

export interface SystemReview {
    fiebre: YesNoDetail;
    altVision: YesNoDetail;
    altAudicion: YesNoDetail;
    altMasticacion: YesNoDetail;
    altDeglucion: YesNoDetail;
    mareos: YesNoDetail;
    cefalea: YesNoDetail;
    altCognicion: YesNoDetail;
    dolorToracico: YesNoDetail;
    disnea: YesNoDetail;
    nauseas: YesNoDetail;
    vomito: YesNoDetail;
    pirosis: YesNoDetail;
    diarrea: YesNoDetail;
    estrenimiento: YesNoDetail;
    altOsteoarticulares: YesNoDetail;
    altPiel: YesNoDetail;
    altGenitourinarias: YesNoDetail;
    alteracionSueno: YesNoDetail;
    otros: string;
}

export interface PhysicalExam {
    peso: string;
    talla: string;
    temp: string;
    pulso: string;
    taAcostado: string;
    taSentado: string;
    taDePie: string;
    frecuenciaRespiratoria: string;
    frecuenciaCardiaca: string;
    perimetroAbdominal: string;
    examenMental: string;
    apariencia: string;
    hidratacion: string;
    pielAnexos: string;
    areas: Record<string, { normal: string; patologico: string }>;
    fuerzaMuscularGrados: string;
    tonoMuscularGrados: string;
    rots: {
        bicipital: string;
        rotuliano: string;
        aquiliano: string;
    };
    cutaneoPlantar: string;
}

export interface Valuations {
    funcionalMesAntes: number;
    funcionalIngreso: number;
    psiquicaMesAntes: number;
    psiquicaIngreso: number;
    pesoActual: string;
    pesoIdeal: string;
    diferenciaPeso: string;
    valoracionSocialResumida: string;
    conQuienVive: 'Solo' | 'Hijos' | 'Conyuge' | 'Cuidadores' | '';
    soporteMedicamentos: string;
    soporteCuidados: string;
    soporteAlimentos: string;
    geriatrico: Record<string, { presente: 'Sí' | 'No' | ''; intervencion: string }>;
    realizadoPor: string;
}

// Represents the content of a single clinical history entry
export interface HistoriaClinicaContent {
    patientData: PatientData;
    antecedents: Antecedents;
    consultationReason: ConsultationReason;
    systemReview: SystemReview;
    physicalExam: PhysicalExam;
    valuations: Valuations;
}

// Represents the full clinical history record from the database
export interface ClinicalHistory {
    id: number;
    created_at: string;
    doctor_id: number;
    doctor_nombre: string;
    doctor_apellidos: string;
    content: HistoriaClinicaContent;
}


const createYesNoDetail = (): YesNoDetail => ({ value: '', details: '' });

export const initialHistoriaClinicaContent: HistoriaClinicaContent = {
    patientData: {
        fecha: new Date().toISOString().split('T')[0], 
        informadoPor: '', 
        informadoPorOtro: '',
        nombre: '',
        apellidos: '',
        edad: '',
        sexo: '',
        estadoCivil: '',
        direccion: '',
        telefono: '',
        numeroRecord: '',
        registroGeriatria: '',
    },
    antecedents: {
        hipertension: createYesNoDetail(), diabetesMellitus: createYesNoDetail(),
        alergias: createYesNoDetail(), epoc: createYesNoDetail(),
        transfusiones: createYesNoDetail(), cirugias: createYesNoDetail(),
        otrosPatologicos: '', tabaco: createYesNoDetail(), alcohol: createYesNoDetail(),
        tisanas: createYesNoDetail(), otrosToxicos: '',
        medicamentos: Array(5).fill({ medicamento: '', dosis: '', tiempoUso: '', prescrito: '', noPrescrito: '' }),
        hipertensionFam: '', diabetesFam: '', tbpFam: '', cancerFam: '',
        enfermedadCardiacaFam: '', demenciasFam: '', otrosFam: '',
    },
    consultationReason: {
        motivo: '', desarrollo: '',
    },
    systemReview: {
        fiebre: createYesNoDetail(), altVision: createYesNoDetail(),
        altAudicion: createYesNoDetail(), altMasticacion: createYesNoDetail(),
        altDeglucion: createYesNoDetail(), mareos: createYesNoDetail(),
        cefalea: createYesNoDetail(), altCognicion: createYesNoDetail(),
        dolorToracico: createYesNoDetail(), disnea: createYesNoDetail(),
        nauseas: createYesNoDetail(), vomito: createYesNoDetail(),
        pirosis: createYesNoDetail(), diarrea: createYesNoDetail(),
        estrenimiento: createYesNoDetail(), altOsteoarticulares: createYesNoDetail(),
        altPiel: createYesNoDetail(), altGenitourinarias: createYesNoDetail(),
        alteracionSueno: createYesNoDetail(), otros: '',
    },
    physicalExam: {
        peso: '', talla: '', temp: '', pulso: '', taAcostado: '', taSentado: '',
        taDePie: '', frecuenciaRespiratoria: '', frecuenciaCardiaca: '',
        perimetroAbdominal: '', examenMental: '', apariencia: '', hidratacion: '',
        pielAnexos: '',
        areas: {},
        fuerzaMuscularGrados: '',
        tonoMuscularGrados: '',
        rots: { bicipital: '', rotuliano: '', aquiliano: '' },
        cutaneoPlantar: '',
    },
    valuations: {
        funcionalMesAntes: 0, funcionalIngreso: 0, psiquicaMesAntes: 0, psiquicaIngreso: 0,
        pesoActual: '', pesoIdeal: '', diferenciaPeso: '', valoracionSocialResumida: '',
        conQuienVive: '', soporteMedicamentos: '', soporteCuidados: '', soporteAlimentos: '',
        geriatrico: {},
        realizadoPor: '',
    }
};