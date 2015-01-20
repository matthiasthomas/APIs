akioo.config(['$translateProvider',
	function($translateProvider) {
		$translateProvider.
		translations('en', {
			menu: {
				accuel: "Home",
				agence: "The Company",
				services: "Services",
				equipe: "Team",
				technologies: "Technologies",
				contact: "Contact"
			},
			slides: {
				1: {
					sentences: {
						1: "Hi, We're Akioo",
						2: "Your web and digital communications agency"
					}
				},
				2: {
					sentences: {
						1: "More Credibility",
						2: "Your website is your business window to the world",
						3: "It must inspire trust and confidence in your clients"
					}
				},
				3: {
					sentences: {
						1: "Fits screens of any size",
						2: "Desktop, Laptop, Tablet, Smartphone"
					}
				}
			},
			sections: {
				agence: {
					caption: "The Company",
					content: {
						h1: "History",
						p: "AKIOO is a start-up, conceived in Canada, but created in France, using the best development tools " +
							"and technologies available on the market to set up web sites and mobile applications of the highest " +
							"quality."
					}
				},
				services: {
					caption: "Services",
					content: {
						1: {
							h3: "Web Sites",
							p: "Responsive websites development"
						},
						2: {
							h3: "Mobile Applications",
							p: "iPhone and Android Applications development"
						},
						3: {
							h3: "Customization",
							p: "Your customer area enables you to analyse your statistics, but you can also customize your website"
						},
						4: {
							h3: "SEO",
							p: "Your website will be given the best processing in terms of referencing"
						}
					}
				},
				equipe: {
					caption: "The Team",
					people: {
						matthias: {
							firstName: "Matthias",
							lastName: "Thomas-Lamotte",
							position: "CEO/Developer",
							description: {
								1: "- Bachelor of Science graduate and studying for a IT Masters at Supinfo.",
								2: "- Loves animals, surfing, the web and surfing the web."
							}
						},
						pauline: {
							firstName: "Pauline",
							lastName: "Jahouel",
							position: "Project Manager/Sales Manager",
							description: {
								1: "- Pleasant and perfectionnist",
								2: "- Loves nature, the sea and mandalas."
							}
						}
					}
				},
				technologies: {
					caption: "Technologies",
					content: {
						h2: {
							1: "The best technologies available",
							2: "For you"
						},
						p: {
							1: "AKIOO uses the latest, fastest, most scalable and safe technologies available.",
							2: "All of these tools are here to guarantee you that the product you asked us to build is even more " +
								"powerful than you imagined."
						}
					}
				},
				contact: {
					h2: "Thanks for your interest",
					p: "Please send us your request, we will be pleased to evaluate it and send you a free quotation " +
						"as quickly as possible.",
					contactBtn: "Contact us!"
				}
			},
			parallaxPhrase: "Your success is ours",
			copyright: "Copyright © 2014 / AKIOO / All rights reserved."
		}).
		translations('fr', {
			menu: {
				accuel: "Accueil",
				agence: "L'agence",
				services: "Les Services",
				equipe: "L'Equipe",
				technologies: "Technologies",
				contact: "Contact"
			},
			slides: {
				1: {
					sentences: {
						1: "Salut, c'est Akioo",
						2: "Votre agence web et de communication digitale"
					}
				},
				2: {
					sentences: {
						1: "+ de crédibilité",
						2: "Votre site web est votre vitrine sur le net",
						3: "Il doit inspirer confiance à vos clients"
					}
				},
				3: {
					sentences: {
						1: "Adaptez à tous supports",
						2: "Bureau, Portable, Tablette, Smartphone"
					}
				}
			},
			sections: {
				agence: {
					caption: "L'agence",
					content: {
						h1: "Histoire",
						p: "AKIOO est une jeune start-up, imaginée au Canada, mais créée en France, utilisant les meilleurs " +
							"outils et les meilleures technologies de développement du marché pour mettre en place des sites web " +
							"et applications mobiles de qualité optimale."
					}
				},
				services: {
					caption: "Les services",
					content: {
						1: {
							h3: "Sites web",
							p: "Développement de sites web responsive"
						},
						2: {
							h3: "Applications Mobile",
							p: "Développment d'applications pour iPhone et Android"
						},
						3: {
							h3: "Customisation",
							p: "Votre espace client vous permet d'analyser vos statistiques, mais aussi de customiser votre site"
						},
						4: {
							h3: "SEO",
							p: "Votre site bénéficiera des meilleurs traitements possibles en terme de référencement"
						}
					}
				},
				equipe: {
					caption: "L'Equipe",
					people: {
						matthias: {
							position: "Directeur/Développeur",
							description: {
								1: "- Diplomé d'un Bachelor of Science et étudiant en Master informatique à SUPINFO.",
								2: "- Aime les animaux, le surf, le web et surfer sur le web."
							}
						},
						pauline: {
							position: "Chef de Projet/Commerciale",
							description: {
								1: "- Avenante et perfectionniste",
								2: "- Aime la nature, la mer et les mandalas."
							}
						}
					}
				},
				technologies: {
					caption: "Les Technologies",
					content: {
						h2: {
							1: "LES MEILLEURS TECHNOLOGIES DISPONIBLES",
							2: "POUR VOUS"
						},
						p: {
							1: "AKIOO utilise les dernières technologies existantes et les plus rapides, évolutives et sécuritaires.",
							2: "Tous ces outils sont là pour vous garantir que le produit que vous nous avez demandé de construire " +
								"soit encore plus puissant que vous ne l'imaginez."
						}
					}
				},
				contact: {
					h2: "Merci pour la visite",
					p: "N'hésitez pas à nous envoyer votre demande, nous serons ravis de l'évaluer et de vous envoyer un devis " +
						"gratuitement dans les plus brefs délais.",
					contactBtn: "Contactez nous!"
				}
			},
			parallaxPhrase: "Votre succès, c'est le notre",
			copyright: "Copyright © 2014 / AKIOO / Tous droits réservés."
		});
	}
]).
run(['$translate', 'localStorageService',
	function($translate, localStorageService) {
		//Set current language
		if (localStorageService.get("userLanguage") !== null) {
			if (localStorageService.get("userLanguage") == "fr" || localStorageService.get("userLanguage") == "en") {
				$translate.use(localStorageService.get("userLanguage"));
			} else {
				$translate.use('fr');
			}
		} else {
			$translate.use('fr');
		}
	}
]);