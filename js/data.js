/* ===== CONFIGURAZIONE ADRY — modifica qui servizi, orari e contatti ===== */
window.ADRY = {
  whatsapp: '393336578268',          // numero WhatsApp (prefisso 39, senza +)
  phone: '333 6578268',
  partnerUrl: 'https://lunaracandeleartigianali.github.io/lunara/',
  instagram: 'https://www.instagram.com/adry_beauty/',
  address: 'Via Primo Maggio, 9/A — Muggiò (MB)',
  promoEnd: '2026-11-30T23:59:59',   // fine promo "Nuova Stagione"

  // Orari di apertura (0=dom ... 6=sab). null = chiuso. DA VERIFICARE con la titolare.
  hours: {
    0: null,
    1: null,
    2: ['09:00', '19:00'],
    3: ['09:00', '19:00'],
    4: ['09:00', '19:00'],
    5: ['09:00', '19:00'],
    6: ['09:00', '17:00']
  },
  slotMinutes: 60,
  closedDates: [],                   // es. ['2026-12-25']

  // Servizi. Prezzi volutamente assenti (solo la promo è nota): aggiungi price:'€ 25' per mostrarli.
  services: [
    { id: 'promo', cat: 'estetica', name: 'Pulizia viso + Scrub corpo', desc: 'Il pacchetto Nuova Stagione: rigenera e illumina il viso, rinnova la pelle del corpo. Unica seduta.', price: '90 €', promo: true, icon: 'sparkle' },
    { id: 'pulizia', cat: 'estetica', name: 'Pulizia viso', desc: 'Detersione profonda, vapore e maschera per una pelle luminosa e purificata.', icon: 'face' },
    { id: 'scrub', cat: 'estetica', name: 'Scrub corpo', desc: 'Elimina le cellule morte e ossigena la pelle, lasciandola setosa.', icon: 'drop' },
    { id: 'massaggio', cat: 'estetica', name: 'Massaggio rilassante', desc: 'Manualità lente e oli caldi per sciogliere tensioni di corpo e mente.', icon: 'lotus' },
    { id: 'laser', cat: 'estetica', name: 'Depilazione laser diodo 808', desc: 'Consulenza con la tecnica specializzata, prova gratuita su una piccola zona e preventivo personalizzato. Pelle liscia, sempre.', badge: 'Prova gratuita', icon: 'sparkle' },
    { id: 'ceretta', cat: 'estetica', name: 'Ceretta', desc: 'Epilazione delicata, anche con cere ipoallergeniche per pelli sensibili.', icon: 'leaf' },
    { id: 'manicure', cat: 'estetica', name: 'Manicure & pedicure', desc: 'Cura di mani e piedi, smalto classico o semipermanente.', icon: 'sparkle' },
    { id: 'taglio', cat: 'parrucchiere', name: 'Taglio & piega', desc: 'Consulenza sul taglio più adatto al tuo viso e al tuo stile.', icon: 'scissors' },
    { id: 'colore', cat: 'parrucchiere', name: 'Colore & riflessi', desc: 'Tinta, colpi di sole e sfumature su misura, con prodotti che rispettano il capello.', icon: 'drop' },
    { id: 'trattamento', cat: 'parrucchiere', name: 'Trattamento ristrutturante', desc: 'Nutre e ripara i capelli spenti o stressati, per più luce e morbidezza.', icon: 'leaf' },
    { id: 'acconciatura', cat: 'parrucchiere', name: 'Acconciature da cerimonia', desc: 'Raccolti e onde per matrimoni, feste e serate speciali.', icon: 'lotus' }
  ],

  // Prodotti. SEGNAPOSTO: sostituisci con i nomi reali (e price:'€ 18' se vuoi mostrare il prezzo).
  lyca: [
    { name: 'Lyca — Detergente viso', desc: 'Pulizia delicata di ogni giorno.', icon: 'face' },
    { name: 'Lyca — Crema idratante', desc: 'Idratazione e luminosità.', icon: 'drop' },
    { name: 'Lyca — Scrub corpo', desc: 'Il rituale del salone, a casa.', icon: 'leaf' },
    { name: 'Lyca — Prodotto capelli', desc: 'Cura quotidiana per capelli sani.', icon: 'scissors' }
  ],
  products: [
    { cat: 'estetica', name: 'Creme e sieri viso', desc: 'Per ogni tipo di pelle.', icon: 'face' },
    { cat: 'estetica', name: 'Oli e creme corpo', desc: 'Nutrimento e morbidezza.', icon: 'lotus' },
    { cat: 'estetica', name: 'Smalti e cura unghie', desc: 'Colori e trattamenti.', icon: 'sparkle' },
    { cat: 'capelli', name: 'Shampoo e balsami', desc: 'Specifici per ogni esigenza.', icon: 'drop' },
    { cat: 'capelli', name: 'Maschere e trattamenti', desc: 'Ristrutturano e nutrono.', icon: 'leaf' },
    { cat: 'capelli', name: 'Styling e finish', desc: 'Per mantenere la piega.', icon: 'scissors' }
  ]
};
