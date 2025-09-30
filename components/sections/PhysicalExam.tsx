
import React from 'react';
import { PhysicalExam as PhysicalExamType } from '../../types';
import { InputField } from '../common/InputField';
import { TextAreaField } from '../common/TextAreaField';
import { SectionTitle } from '../common/SectionTitle';

interface Props {
    data: PhysicalExamType;
    onChange: (field: keyof PhysicalExamType, value: any, subField?: string, subSubField?: string) => void;
}

const physicalExamAreas = {
    "Cabeza": ["ojos", "fondoOjo", "conjuntivas", "pupilas", "lagrimeo", "parpados"],
    "Nariz": ["nariz", "mucosaSeptum"],
    "Boca": ["labios", "lengua", "encias", "orofaringe", "dentadura"],
    "Oidos": ["pabellonAuricular", "condAuditivoExt"],
    "Cuello": ["movsLaterales", "pulsoCarotideo", "tiroides", "ingurgitacionYugular", "reflujoHY"],
    "Tórax": ["inspGralTorax", "mamas", "auscPulmonar", "percusionPulmonar", "ruidosCardiacos", "choquePunta", "ritmo", "soplos"],
    "Abdomen": ["inspGralAbdomen", "palpacionHigado", "palpacionBazo", "latidoAortico", "auscultacion", "percusion", "hernias", "cicatrices"],
    "Ex. rectal": ["exRectal"],
    "Genito Urinario": ["genExternos", "tVaginal", "tRectal", "exProstata"],
    "Musculoesquelético": ["cuelloMusc", "hombros", "pelvis", "columnaToracica", "columnaLumbar", "rodillas", "tobillos", "manos", "pies"],
    "Sistema locomotor": ["movilidadArticular", "fuerzaMuscular", "formaArticular", "marcha"],
    "Neurológico": ["estadoConciencia", "sensibilidad", "movilidad", "fuerza", "paresCraneales", "coordinacion", "masaMuscular", "movsAnormales"],
    "Pulsos": ["pulsosCarotideo", "pulsosRadial", "pulsosFemoral", "pulsosPopliteo", "pulsosPedio"],
    "Adenopatías": ["adenoAxilares", "adenoInguinales"],
};

const areaLabels: Record<string, string> = {
    ojos: "Ojos", fondoOjo: "Fondo de ojo", conjuntivas: "Conjuntivas", pupilas: "Pupilas", lagrimeo: "Lagrimeo", parpados: "Párpados",
    nariz: "Nariz", mucosaSeptum: "Mucosa/septum",
    labios: "Labios", lengua: "Lengua", encias: "Encías", orofaringe: "Orofaringe", dentadura: "Dentadura",
    pabellonAuricular: "Pabellón auricular", condAuditivoExt: "Cond. Auditivo Ext.",
    movsLaterales: "Movs. Laterales", pulsoCarotideo: "Pulso carotídeo", tiroides: "Tiroides", ingurgitacionYugular: "Ingurgitación yugular", reflujoHY: "Reflujo H-Y",
    inspGralTorax: "Insp. Gral", mamas: "Mamas", auscPulmonar: "Ausc.Pulmonar", percusionPulmonar: "Percusión Pulmonar", ruidosCardiacos: "Ruidos Cardiacos", choquePunta: "Choque de la punta", ritmo: "Ritmo", soplos: "Soplos",
    inspGralAbdomen: "Insp. gral.", palpacionHigado: "Palpación hígado", palpacionBazo: "Palpación bazo", latidoAortico: "Latido aortico", auscultacion: "Auscultación", percusion: "Percusión", hernias: "Hernias", cicatrices: "Cicatrices",
    exRectal: "Ex. rectal",
    genExternos: "Gen. Externos", tVaginal: "T. vaginal", tRectal: "T. rectal", exProstata: "Ex. Próstata",
    cuelloMusc: "Cuello", hombros: "Hombros", pelvis: "Pelvis", columnaToracica: "Columna torácica", columnaLumbar: "Columna lumbar", rodillas: "Rodillas", tobillos: "Tobillos", manos: "Manos", pies: "Pies",
    movilidadArticular: "Movilidad articular", fuerzaMuscular: "Fuerza muscular", formaArticular: "Forma articular", marcha: "Marcha",
    estadoConciencia: "Estado de conciencia", sensibilidad: "Sensibilidad", movilidad: "Movilidad", fuerza: "Fuerza", paresCraneales: "Pares craneales", coordinacion: "Coordinación", masaMuscular: "Masa muscular", movsAnormales: "Movimientos anormales",
    pulsosCarotideo: "Carotídeo", pulsosRadial: "Radial", pulsosFemoral: "Femoral", pulsosPopliteo: "Poplíteo", pulsosPedio: "Pedio",
    adenoAxilares: "Axilares", adenoInguinales: "Inguinales",
};


const RadioGroup: React.FC<{label:string, name: string, value: string, options: string[], onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({label, name, value, options, onChange}) => (
    <div className="flex items-center justify-between py-2 border-b">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex space-x-4">
            {options.map(opt => (
                <label key={opt} className="flex items-center">
                    <input type="radio" name={name} value={opt} checked={value === opt} onChange={onChange} className="form-radio h-4 w-4 text-primary-600"/>
                    <span className="ml-2 text-sm">{opt}</span>
                </label>
            ))}
        </div>
    </div>
);


export const PhysicalExam: React.FC<Props> = ({ data, onChange }) => {
    
    return (
        <div>
            <SectionTitle>Examen Físico</SectionTitle>
            
            <h3 className="text-md font-semibold text-gray-700 mb-3">Datos básicos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InputField label="Peso" id="peso" value={data.peso} onChange={e => onChange('peso', e.target.value)} />
                <InputField label="Talla" id="talla" value={data.talla} onChange={e => onChange('talla', e.target.value)} />
                <InputField label="Temp." id="temp" value={data.temp} onChange={e => onChange('temp', e.target.value)} />
                <InputField label="Pulso" id="pulso" value={data.pulso} onChange={e => onChange('pulso', e.target.value)} />
                <InputField label="TA Acostado" id="taAcostado" value={data.taAcostado} onChange={e => onChange('taAcostado', e.target.value)} />
                <InputField label="TA Sentado" id="taSentado" value={data.taSentado} onChange={e => onChange('taSentado', e.target.value)} />
                <InputField label="TA De pie" id="taDePie" value={data.taDePie} onChange={e => onChange('taDePie', e.target.value)} />
                <InputField label="Frecuencia Respiratoria" id="frecuenciaRespiratoria" value={data.frecuenciaRespiratoria} onChange={e => onChange('frecuenciaRespiratoria', e.target.value)} />
                <InputField label="Frecuencia Cardiaca" id="frecuenciaCardiaca" value={data.frecuenciaCardiaca} onChange={e => onChange('frecuenciaCardiaca', e.target.value)} />
                <InputField label="Perimetro Abdominal (en cm)" id="perimetroAbdominal" value={data.perimetroAbdominal} onChange={e => onChange('perimetroAbdominal', e.target.value)} />
            </div>

            <TextAreaField label="Examen Mental" id="examenMental" value={data.examenMental} onChange={e => onChange('examenMental', e.target.value)} className="mt-6" />

            <h3 className="text-md font-semibold text-gray-700 mt-6 mb-3">Condición general</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Apariencia" id="apariencia" value={data.apariencia} onChange={e => onChange('apariencia', e.target.value)} />
                <InputField label="Hidratación" id="hidratacion" value={data.hidratacion} onChange={e => onChange('hidratacion', e.target.value)} />
                <InputField label="Piel y anexos" id="pielAnexos" value={data.pielAnexos} onChange={e => onChange('pielAnexos', e.target.value)} />
            </div>

            <div className="mt-6">
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Área del cuerpo</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Normal</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Patológico</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {Object.entries(physicalExamAreas).map(([category, areas]) => (
                            <React.Fragment key={category}>
                                <tr>
                                    <td colSpan={3} className="px-4 py-2 bg-gray-50 text-sm font-bold text-gray-600">{category}</td>
                                </tr>
                                {areas.map(area => (
                                <tr key={area}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{areaLabels[area]}</td>
                                    <td className="px-6 py-4">
                                        <TextAreaField label="" id={`${area}-normal`} value={data.areas[area]?.normal || ''} onChange={e => onChange('areas', e.target.value, area, 'normal')} rows={1} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <TextAreaField label="" id={`${area}-patologico`} value={data.areas[area]?.patologico || ''} onChange={e => onChange('areas', e.target.value, area, 'patologico')} rows={1} />
                                    </td>
                                </tr>
                                ))}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <RadioGroup label="Fuerza muscular" name="fuerzaMuscularGrados" value={data.fuerzaMuscularGrados} options={['I', 'II', 'III', 'IV', 'V']} onChange={e => onChange('fuerzaMuscularGrados', e.target.value)} />
                <RadioGroup label="Tono muscular" name="tonoMuscularGrados" value={data.tonoMuscularGrados} options={['I', 'II', 'III', 'IV', 'V']} onChange={e => onChange('tonoMuscularGrados', e.target.value)} />
                
                <h3 className="text-md font-semibold text-gray-700 pt-4">ROTS</h3>
                <RadioGroup label="Bicipital" name="rotsBicipital" value={data.rots.bicipital} options={['I', 'II', 'III', 'IV', 'V']} onChange={e => onChange('rots', e.target.value, 'bicipital')} />
                <RadioGroup label="Rotuliano" name="rotsRotuliano" value={data.rots.rotuliano} options={['I', 'II', 'III', 'IV', 'V']} onChange={e => onChange('rots', e.target.value, 'rotuliano')} />
                <RadioGroup label="Aquiliano" name="rotsAquiliano" value={data.rots.aquiliano} options={['I', 'II', 'III', 'IV', 'V']} onChange={e => onChange('rots', e.target.value, 'aquiliano')} />

                <InputField label="Cutáneo plantar" id="cutaneoPlantar" value={data.cutaneoPlantar} onChange={e => onChange('cutaneoPlantar', e.target.value)} />
            </div>
        </div>
    );
};
