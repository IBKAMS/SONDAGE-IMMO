import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaHandshake,
  FaChartLine,
  FaShieldAlt,
  FaUsers,
  FaMapMarkedAlt,
  FaCheckCircle,
  FaQuestionCircle
} from 'react-icons/fa';
import API_URL from '../config';
import './OptionAchat.css';

const OptionAchat = () => {
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [content, setContent] = useState(null);
  const [logements, setLogements] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/option-achat-content`);
        if (response.ok) {
          const data = await response.json();
          // L'API retourne {success: true, data: {...}}, donc on extrait data.data
          if (data.success && data.data) {
            setContent(data.data);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du contenu:', error);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    const fetchLogements = async () => {
      try {
        const response = await fetch(`${API_URL}/api/logements`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setLogements(data.data);
          }
        }
      } catch (error) {
        console.error('Erreur logements:', error);
      }
    };
    fetchLogements();
  }, []);

  const optionsFinancement = content?.financementSection ? [
    content.financementSection.option1 ? {
      titre: content.financementSection.option1.titre,
      icon: <FaMoneyBillWave />,
      avantages: [
        content.financementSection.option1.avantage1,
        content.financementSection.option1.avantage2,
        content.financementSection.option1.avantage3,
        content.financementSection.option1.avantage4
      ].filter(Boolean),
      description: content.financementSection.option1.description,
      popular: content.financementSection.option1.popular
    } : null,
    content.financementSection.option2 ? {
      titre: content.financementSection.option2.titre,
      icon: <FaCalendarAlt />,
      avantages: [
        content.financementSection.option2.avantage1,
        content.financementSection.option2.avantage2,
        content.financementSection.option2.avantage3,
        content.financementSection.option2.avantage4
      ].filter(Boolean),
      description: content.financementSection.option2.description,
      popular: content.financementSection.option2.popular
    } : null,
    content.financementSection.option3 ? {
      titre: content.financementSection.option3.titre,
      icon: <FaHandshake />,
      avantages: [
        content.financementSection.option3.avantage1,
        content.financementSection.option3.avantage2,
        content.financementSection.option3.avantage3,
        content.financementSection.option3.avantage4
      ].filter(Boolean),
      description: content.financementSection.option3.description,
      popular: content.financementSection.option3.popular
    } : null
  ].filter(Boolean) : [
    {
      titre: 'Paiement Comptant',
      icon: <FaMoneyBillWave />,
      avantages: [
        'Réduction immédiate de 5%',
        'Priorité sur le choix du logement',
        'Frais de dossier offerts',
        'Livraison garantie en priorité'
      ],
      description: 'Bénéficiez d\'avantages exclusifs en réglant comptant'
    },
    {
      titre: 'Échelonnement Promoteur',
      icon: <FaCalendarAlt />,
      avantages: [
        'Apport initial de 30%',
        'Solde échelonné jusqu\'à la livraison',
        'Sans intérêts bancaires',
        'Flexibilité de paiement'
      ],
      description: 'Un plan de paiement adapté à votre rythme',
      popular: true
    },
    {
      titre: 'Financement Bancaire',
      icon: <FaHandshake />,
      avantages: [
        'Partenariats avec banques locales',
        'Taux préférentiels négociés',
        'Accompagnement dans les démarches',
        'Jusqu\'à 20 ans de crédit'
      ],
      description: 'Nos partenaires bancaires vous accompagnent'
    }
  ];

  const avantages = content?.avantagesSection ? [
    content.avantagesSection.avantage1 ? {
      icon: <FaMapMarkedAlt />,
      titre: content.avantagesSection.avantage1.titre,
      description: content.avantagesSection.avantage1.description
    } : null,
    content.avantagesSection.avantage2 ? {
      icon: <FaChartLine />,
      titre: content.avantagesSection.avantage2.titre,
      description: content.avantagesSection.avantage2.description
    } : null,
    content.avantagesSection.avantage3 ? {
      icon: <FaShieldAlt />,
      titre: content.avantagesSection.avantage3.titre,
      description: content.avantagesSection.avantage3.description
    } : null,
    content.avantagesSection.avantage4 ? {
      icon: <FaUsers />,
      titre: content.avantagesSection.avantage4.titre,
      description: content.avantagesSection.avantage4.description
    } : null
  ].filter(Boolean) : [
    {
      icon: <FaMapMarkedAlt />,
      titre: 'Emplacement Premium',
      description: 'Vue sur la lagune Ébrié, à Port-Bouët, zone en plein développement'
    },
    {
      icon: <FaChartLine />,
      titre: 'Investissement Rentable',
      description: 'Fort potentiel de valorisation dans une zone stratégique'
    },
    {
      icon: <FaShieldAlt />,
      titre: 'Sécurité & Qualité',
      description: 'Construction aux normes internationales, matériaux premium'
    },
    {
      icon: <FaUsers />,
      titre: 'Cadre de Vie Exceptionnel',
      description: 'Espaces verts, aires de jeux, commerces de proximité'
    }
  ];

  const timeline = content?.timelineSection ? [
    content.timelineSection.phase1 ? {
      phase: content.timelineSection.phase1.phase,
      titre: content.timelineSection.phase1.titre,
      date: content.timelineSection.phase1.date,
      statut: content.timelineSection.phase1.statut,
      description: content.timelineSection.phase1.description
    } : null,
    content.timelineSection.phase2 ? {
      phase: content.timelineSection.phase2.phase,
      titre: content.timelineSection.phase2.titre,
      date: content.timelineSection.phase2.date,
      statut: content.timelineSection.phase2.statut,
      description: content.timelineSection.phase2.description
    } : null,
    content.timelineSection.phase3 ? {
      phase: content.timelineSection.phase3.phase,
      titre: content.timelineSection.phase3.titre,
      date: content.timelineSection.phase3.date,
      statut: content.timelineSection.phase3.statut,
      description: content.timelineSection.phase3.description
    } : null
  ].filter(Boolean) : [
    {
      phase: 'Phase Actuelle',
      titre: 'Commercialisation',
      date: 'Novembre 2024',
      statut: 'En cours',
      description: 'Réservations et préventes ouvertes'
    },
    {
      phase: 'Phase 2',
      titre: 'Début des Travaux',
      date: 'T1 2025',
      statut: 'À venir',
      description: 'Démarrage de la construction'
    },
    {
      phase: 'Phase 3',
      titre: 'Livraison',
      date: 'T4 2026',
      statut: 'Prévu',
      description: 'Remise des clés aux propriétaires'
    }
  ];

  const faqs = content?.faqSection ? [
    content.faqSection.faq1 ? {
      question: content.faqSection.faq1.question,
      answer: content.faqSection.faq1.answer
    } : null,
    content.faqSection.faq2 ? {
      question: content.faqSection.faq2.question,
      answer: content.faqSection.faq2.answer
    } : null,
    content.faqSection.faq3 ? {
      question: content.faqSection.faq3.question,
      answer: content.faqSection.faq3.answer
    } : null,
    content.faqSection.faq4 ? {
      question: content.faqSection.faq4.question,
      answer: content.faqSection.faq4.answer
    } : null,
    content.faqSection.faq5 ? {
      question: content.faqSection.faq5.question,
      answer: content.faqSection.faq5.answer
    } : null,
    content.faqSection.faq6 ? {
      question: content.faqSection.faq6.question,
      answer: content.faqSection.faq6.answer
    } : null
  ].filter(Boolean) : [
    {
      question: 'Quels documents sont nécessaires pour réserver ?',
      answer: 'Pour réserver votre logement, vous aurez besoin d\'une pièce d\'identité en cours de validité, d\'un justificatif de domicile récent, et de fournir un acompte de réservation. Notre équipe vous accompagnera dans toutes les démarches.'
    },
    {
      question: 'Le prix inclut-il les finitions ?',
      answer: 'Oui, tous nos logements sont livrés avec des finitions haut de gamme : carrelage, peinture, cuisine équipée, sanitaires premium, portes et fenêtres aluminium. Les climatiseurs sont également inclus.'
    },
    {
      question: 'Puis-je visiter un logement témoin ?',
      answer: 'Un appartement témoin sera disponible dès le début des travaux (T1 2025). En attendant, nous vous proposons des visites virtuelles 3D et des plans détaillés pour visualiser votre futur logement.'
    },
    {
      question: 'Quelles sont les garanties proposées ?',
      answer: 'Tous nos logements bénéficient de la garantie décennale, de la garantie de parfait achèvement (1 an), et de la garantie biennale. Nous travaillons avec des assureurs reconnus pour votre sécurité.'
    },
    {
      question: 'Y a-t-il des frais supplémentaires à prévoir ?',
      answer: 'Les frais de notaire (environ 10% du prix) et les frais de dossier bancaire (si financement) sont à prévoir. Nous vous fournissons une estimation détaillée lors de votre rendez-vous.'
    },
    {
      question: 'Puis-je revendre avant la livraison ?',
      answer: 'Oui, vous êtes propriétaire dès la signature chez le notaire. Vous pouvez donc revendre votre bien en VEFA (Vente en État Futur d\'Achèvement) avant même la livraison.'
    }
  ];

  const toggleFAQ = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const formatPrix = (prix) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(prix);
  };

  return (
    <div className="option-achat-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>{content?.hero?.title || "Options d'Achat"}</h1>
            <p className="hero-subtitle">
              {content?.hero?.subtitle || "Découvrez nos solutions de financement flexibles et choisissez le logement qui correspond à vos ambitions dans la CITÉ KONGO"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>{content?.ctaSection?.title || "Prêt à Concrétiser Votre Projet ?"}</h2>
            <p>
              {content?.ctaSection?.description || "Remplissez notre questionnaire personnalisé pour recevoir une offre adaptée à vos besoins et votre budget. Notre équipe vous contactera dans les 24h."}
            </p>
            <button
              className="btn btn-primary btn-large"
              onClick={() => navigate('/questionnaire')}
            >
              {content?.ctaSection?.buttonText || "Commencer le Questionnaire"}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Types de Logements */}
      <section className="logements-section">
        <div className="container">
          <div className="section-header">
            <h2>{content?.logementsSection?.title || "Nos Types de Logements"}</h2>
            <p>{content?.logementsSection?.subtitle || "Des espaces conçus pour votre confort et votre bien-être"}</p>
          </div>

          <div className="logements-grid">
            {logements.map((logement, index) => (
              <motion.div
                key={logement._id || index}
                className="logement-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="logement-header">
                  <FaHome className="logement-icon" />
                  <h3>{logement.nom}</h3>
                </div>
                <div className="logement-details">
                  <div className="detail-item">
                    <span className="label">Surface:</span>
                    <span className="value">{logement.superficie} m²</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Chambres:</span>
                    <span className="value">{logement.nombreChambres} chambres</span>
                  </div>
                </div>
                <div className="logement-prix">
                  <span className="prix-label">Prix:</span>
                  <span className="prix">{formatPrix(logement.prix)}</span>
                </div>
                <p className="logement-description">{logement.description.substring(0, 150)}...</p>
                <ul className="caracteristiques-list">
                  {logement.equipements.slice(0, 6).map((equip, idx) => (
                    <li key={idx}>
                      <FaCheckCircle className="check-icon" />
                      {equip}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Options de Financement */}
      <section className="financement-section">
        <div className="container">
          <div className="section-header">
            <h2>{content?.financementSection?.title || "Solutions de Financement"}</h2>
            <p>{content?.financementSection?.subtitle || "Choisissez la formule qui vous convient le mieux"}</p>
          </div>

          <div className="financement-grid">
            {optionsFinancement.map((option, index) => (
              <motion.div
                key={index}
                className={`financement-card ${option.popular ? 'popular' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {option.popular && <div className="popular-badge">Recommandé</div>}
                <div className="financement-icon">{option.icon}</div>
                <h3>{option.titre}</h3>
                <p className="financement-description">{option.description}</p>
                <ul className="avantages-list">
                  {option.avantages.map((avantage, idx) => (
                    <li key={idx}>
                      <FaCheckCircle />
                      {avantage}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="avantages-section">
        <div className="container">
          <div className="section-header">
            <h2>{content?.avantagesSection?.title || "Pourquoi Investir dans la CITÉ KONGO ?"}</h2>
          </div>

          <div className="avantages-grid">
            {avantages.map((avantage, index) => (
              <motion.div
                key={index}
                className="avantage-card"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="avantage-icon">{avantage.icon}</div>
                <h3>{avantage.titre}</h3>
                <p>{avantage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <h2>{content?.timelineSection?.title || "Calendrier du Projet"}</h2>
            <p>{content?.timelineSection?.subtitle || "Les étapes clés de votre investissement"}</p>
          </div>

          <div className="timeline">
            {timeline.map((phase, index, arr) => (
              <motion.div
                key={index}
                className={`timeline-item ${phase.statut.toLowerCase()}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="timeline-marker">
                  <div className="timeline-dot"></div>
                  {index < arr.length - 1 && <div className="timeline-line"></div>}
                </div>
                <div className="timeline-content">
                  <span className="timeline-phase">{phase.phase}</span>
                  <h3>{phase.titre}</h3>
                  <span className="timeline-date">{phase.date}</span>
                  <p>{phase.description}</p>
                  <span className={`timeline-status ${phase.statut.toLowerCase()}`}>
                    {phase.statut}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2>{content?.faqSection?.title || "Questions Fréquentes"}</h2>
            <p>{content?.faqSection?.subtitle || "Trouvez les réponses à vos questions"}</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className={`faq-item ${activeQuestion === index ? 'active' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <FaQuestionCircle className={`faq-icon ${activeQuestion === index ? 'rotate' : ''}`} />
                </button>
                <div className={`faq-answer ${activeQuestion === index ? 'show' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OptionAchat;
