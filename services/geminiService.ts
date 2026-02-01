import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeIncident = async (description: string, type: string): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Agis en tant que Responsable QHSE (Qualité, Hygiène, Sécurité, Environnement) Senior.
      Analyse la description de l'incident suivant de type "${type}" :
      "${description}"

      Fournis une réponse en format Markdown structurée ainsi :
      1. **Causes Racines Potentielles** (Méthode des 5 Pourquoi).
      2. **Actions Correctives Immédiates Suggérées**.
      3. **Mesures Préventives à Long Terme**.
      4. **Estimation de la Catégorie de Risque**.
      
      Réponds uniquement en Français.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Impossible de générer l'analyse pour le moment.";
  } catch (error) {
    console.error("Erreur API Gemini:", error);
    return "Erreur : Impossible de se connecter à l'assistant IA. Vérifiez votre clé API.";
  }
};

export const suggestRiskControls = async (hazard: string): Promise<string> => {
    try {
        const model = 'gemini-3-flash-preview';
        const prompt = `
          En tant qu'évaluateur des risques sécurité, suggère une hiérarchie des mesures de contrôle (Élimination, Substitution, Ingénierie, Administratif, EPI) 
          pour le danger suivant : "${hazard}".
          Formate la réponse sous forme de liste concise en Français.
        `;
    
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
        });
    
        return response.text || "Aucune suggestion disponible.";
      } catch (error) {
        console.error("Erreur API Gemini:", error);
        return "Erreur lors de l'analyse du danger.";
      }
};

export const generateExecutiveReport = async (stats: any): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Rédige un rapport exécutif mensuel QHSE (Qualité, Hygiène, Sécurité, Environnement) en Français pour la direction.
      Le rapport doit être professionnel, clair et accessible à quelqu'un qui n'est pas expert technique.
      
      Utilise les statistiques suivantes :
      - Nombre total d'incidents ce mois-ci : ${stats.incidents}
      - Incidents ouverts : ${stats.openIncidents}
      - Risques critiques identifiés : ${stats.criticalRisks}
      - Taux de conformité global : ${stats.compliance}%
      
      Structure du rapport :
      ## 1. Synthèse Globale
      Un paragraphe résumant la performance sécurité du mois.
      
      ## 2. Analyse des Incidents
      Commentaire sur le volume d'incidents et la réactivité.
      
      ## 3. Recommandations Prioritaires
      2 ou 3 actions clés à entreprendre basées sur le fait qu'il y a ${stats.criticalRisks} risques critiques.
      
      Ne pas inventer de faux noms, rester factuel.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Génération du rapport échouée.";
  } catch (error) {
    console.error("Erreur API Gemini:", error);
    return "Erreur lors de la génération du rapport.";
  }
};

export const generateJSA = async (permitType: string, description: string): Promise<{hazards: string, precautions: string}> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Réalise une Analyse de Sécurité de Tâche (AST/JSA) rapide pour un permis de travail de type "${permitType}".
      Description de la tâche : "${description}".
      
      Retourne UNIQUEMENT un objet JSON valide sans Markdown avec deux champs :
      - "hazards": Une liste succincte des principaux dangers (texte simple).
      - "precautions": Une liste des mesures de prévention obligatoires et EPI nécessaires (texte simple).
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const jsonText = response.text || "{}";
    const result = JSON.parse(jsonText);
    return {
      hazards: result.hazards || "Dangers non identifiés",
      precautions: result.precautions || "Précautions standard applicables"
    };

  } catch (error) {
    console.error("Erreur API Gemini JSA:", error);
    return { hazards: "Erreur analyse IA", precautions: "Appliquer les standards QHSE en vigueur" };
  }
};