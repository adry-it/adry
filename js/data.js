/* ===== CONFIGURAZIONE ADRY — modifica qui servizi, orari e contatti ===== */
window.ADRY = {
  whatsapp: '393336578268',          // numero WhatsApp (prefisso 39, senza +)
  phone: '333 6578268',
  partnerUrl: 'https://lunaracandeleartigianali.github.io/lunara/',
  instagram: 'https://www.instagram.com/adry_beauty/',
  address: 'Via Primo Maggio, 9/A — Muggiò (MB)',
  promoEnd: '2026-11-30T23:59:59',   // fine promo "Nuova Stagione"

  // Orari del NEGOZIO (vendita prodotti). 0=dom ... 6=sab. null = chiuso; ogni giorno è un elenco di fasce [apre, chiude].
  hours: {
    0: null,
    1: [['09:00', '12:30'], ['16:00', '19:00']],
    2: [['09:00', '12:30'], ['16:00', '19:00']],
    3: [['09:00', '12:30'], ['16:00', '19:00']],
    4: [['09:00', '12:30']],
    5: [['09:00', '12:30'], ['16:00', '19:00']],
    6: [['09:00', '12:30']]
  },
  // Estetica e parrucchiere lavorano su appuntamento, anche fuori dagli orari del negozio:
  // nel calendario si propongono orari indicativi dalle 08:00 alle 20:00, confermati poi su WhatsApp.
  bookingFrom: '08:00',
  bookingTo: '20:00',
  slotMinutes: 60,
  closedDates: [],                   // es. ['2026-12-25']

  // Servizi. Prezzi volutamente assenti (solo la promo è nota): aggiungi price:'€ 25' per mostrarli.
  // I prodotti Lyca (negozio online) si gestiscono da telefono dal pannello /admin: vedi data/lyca.json.
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
  ]
};
