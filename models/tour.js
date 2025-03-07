const mongoose = require('mongoose');

const tourDetailsSchema = new mongoose.Schema({
  uuid: { type: String, default: null },
  isStandard: { type: Boolean, default: false },
  isDeluxe: { type: Boolean, default: false },
  minPeople: {
    enabled: { type: Boolean, default: false },
    people: { type: Number, default: 0 },

  },
  groupSize:
    { type: String },
  isPremium: { type: Boolean, default: false },
  name: { type: String, default: null },
  overview: { type: String, default: null },
  location: { type: String, default: null },
  duration: { type: Number },
  transportation: { type: Boolean },
  meals: { type: Boolean, },
  activities: { type: Boolean, default: false },
  hotel: { type: Boolean, },
  siteSeen: { type: Boolean, },
  welcomeDrinks: {
    type: Boolean,
  },
  groupSizes: [
    {
      size: { type: String, }, // Example: "1-10", "1-15", etc.
      car: {
        name: { type: String, }, // Car name
        departure: { type: String, }, // Departure location
        arrival: { type: String, }, // Arrival location
        category: { type: String, }, // Car category
        maxPeople: { type: Number, }, // Max people allowed
        description: { type: String }, // Car description
        time: { type: String }, // Travel time
        photos: { type: [String], default: [] }, // Array of image URLs
      },
    },
  ],
  
  termsAndConditions: { type: String },
  languages: { type: String },
  availableDates: { type: String },
  departureDetails: { type: String },
  knowBeforeYouGo: { type: String },
  additionalInfo: { type: String },
  bannerImage: { type: String, default: null },
  images: [{ type: String }],
  country: { type: String },
  city: { type: String },
  state: { type: String },
  destinationId: { type: String },
  categories: [{ type: String }],
  partialPayment: {
    enabled: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },

  },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String }, // Comma-separated keywords
  canonicalUrl: { type: String },

  openGraph: {
    title: { type: String,},
    description: { type: String },
    url: { type: String },

    type: { type: String, default: "website" },
  },

  twitter: {
    title: { type: String,},
    description: { type: String },

  },
  // Fixed Dates details
  fixedDates: {
    enabled: { type: Boolean, default: false },
    seatsAvailable: { type: Number, default: 0 },
    priceChangePerPerson: { type: Number, default: 0 },
  },

  // Open Hours details
  openHours: {
    enabled: { type: Boolean, default: false },
    pricePerPerson: { type: Number, default: 0 },
    groupSize: { type: Number, default: 0 },
    maxPeople: { type: Number, default: 0 },
  },

  standardDetails: {
    seasons: [
      {
        isAvailable: { type: Boolean, default: false },
        seasonName: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        pricing: [
          {
            day: { type: Number, default: 1 },
            price: { type: Number, default: 0 },
            rooms: { type: Number, default: 0 },
            person: { type: Number, default: 1 },
          }
        ]
      }
    ],
    cancellationPolicy: { type: String },
    highlights: { type: String },
    whatsIncluded: { type: String },
    whatsExcluded: { type: String },
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    itineraries: [
      {
        title: { type: String },
        duration: { type: String },
        photos: [{ type: String }],
        description: { type: String },
        day: { type: Number },
        meals: {
          isAvailable: { type: Boolean },
          breakfast: {
            isAvailable: { type: Boolean, default: false },
            name: { type: String, default: '' },
            photos: [{ type: String }]  // array of photo URLs
          },
          lunch: {
            isAvailable: { type: Boolean, default: false },
            name: { type: String, default: '' },
            photos: [{ type: String }]
          },
          dinner: {
            isAvailable: { type: Boolean, default: false },
            name: { type: String, default: '' },
            photos: [{ type: String }]
          }
        }
        ,
        hotel: {
          isIncluded: { type: Boolean, default: false },
          name: { type: String, default: "" },
          url: { type: String, default: "" },
          hotelCategory: [{ type: String, default: "" }],
          hotelImages: [{ type: String, default: [] }],
          roomPrice: { type: Number, default: null },
          roomCategory: { type: String, default: "" },
          roomImages: [{ type: String, default: [] }],
          location: { type: String, default: "" },
          beds: {
            doubleBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
            tripleBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
            fourBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
            fiveBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
            sixBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
          }
        },
        activity: [{
          isIncluded: { type: Boolean, default: false },
          name: { type: String, default: "" },
          description: { type: String, default: "" },
          price: { type: String, default: "" },
          photos: [{ type: String, default: [] }]
        }],

        siteSeen: [{
          isAvailable: { type: Boolean, default: false },
          name: { type: String, default: "" },
          description: { type: String, default: "" },
          photos: [{ type: String, default: [] }]
        }],
        transportation: {
          isIncluded: { type: Boolean, default: false },
          carGroups:[
            {
              groupSize: { type: String, default: "" },
              car: {
                isIncluded: { type: Boolean, default: false },
                name: { type: String, default: "" },
                category: { type: String, default: "" },
                description: { type: String, default: "" },
                departureTime: { type: String, default: "" },
                photos: [{ type: String, default: [] }],
                price: { type: Number },
                maxPeople: { type: Number },
                departureFrom: { type: String, default: "" },
                arrivalTo: { type: String, default: "" },
              },
            },
          ],
        
          bus: {
            isIncluded: { type: Boolean, default: false },
            name: { type: String, default: "" },
            category: { type: String, default: "" },
            description: { type: String, default: "" },
            departureTime: { type: String, default: "" },
            photos: [{ type: String, default: [] }],
            price: { type: Number },
            departureFrom: { type: String, default: "" },
            arrivalTo: { type: String, default: "" },

          },
          train: {
            isIncluded: { type: Boolean, default: false },
            name: { type: String, default: "" },
            category: { type: String, default: "" },
            description: { type: String, default: "" },
            departureTime: { type: String, default: "" },
            photos: [{ type: String, default: [] }],
            price: { type: Number },
            departureFrom: { type: String, default: "" },
            arrivalTo: { type: String, default: "" },
          },
          flight: {
            isIncluded: { type: Boolean, default: false },
            name: { type: String, default: "" },
            category: { type: String, default: "" },
            description: { type: String, default: "" },
            departureTime: { type: String, default: "" },
            photos: [{ type: String, default: [] }],
            price: { type: Number },
            departureFrom: { type: String, default: "" },
            arrivalTo: { type: String, default: "" },
          }
        },

      },
    ],
  },

  deluxeDetails: {
    seasons: [
      {
        isAvailable: { type: Boolean, default: false },
        seasonName: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        pricing: [
          {
            day: { type: Number, default: 1 },
            price: { type: Number, default: 0 },
            rooms: { type: Number, default: 0 },
            person: { type: Number, default: 1 },
          }
        ]
      }
    ],
    cancellationPolicy: { type: String },
    highlights: { type: String },
    whatsIncluded: { type: String },
    whatsExcluded: { type: String },
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    itineraries: [
      {
        title: { type: String },
        duration: { type: String },
        photos: [{ type: String }],
        description: { type: String },
        day: { type: Number },
        meals: {
          isAvailable: { type: Boolean },
          breakfast: {
            isAvailable: { type: Boolean, default: false },
            name: { type: String, default: '' },
            photos: [{ type: String }]  // array of photo URLs
          },
          lunch: {
            isAvailable: { type: Boolean, default: false },
            name: { type: String, default: '' },
            photos: [{ type: String }]
          },
          dinner: {
            isAvailable: { type: Boolean, default: false },
            name: { type: String, default: '' },
            photos: [{ type: String }]
          }
        }
        ,
        hotel: {
          isIncluded: { type: Boolean, default: false },
          name: { type: String, default: "" },
          url: { type: String, default: "" },
          hotelCategory: [{ type: String, default: "" }],
          hotelImages: [{ type: String, default: [] }],
          roomPrice: { type: Number, default: null },
          roomCategory: { type: String, default: "" },
          roomImages: [{ type: String, default: [] }],
          location: { type: String, default: "" },
          beds: {
            doubleBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
            tripleBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
            fourBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
            fiveBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
            sixBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
          }
        },
        activity: [{
          isIncluded: { type: Boolean, default: false },
          name: { type: String, default: "" },
          description: { type: String, default: "" },
          price: { type: String, default: "" },
          photos: [{ type: String, default: [] }]
        }],

        siteSeen: [{
          isAvailable: { type: Boolean, default: false },
          name: { type: String, default: "" },
          description: { type: String, default: "" },
          photos: [{ type: String, default: [] }]
        }],
        transportation: {
          isIncluded: { type: Boolean, default: false },
          car: {
            isIncluded: { type: Boolean, default: false },


            name: { type: String, default: "" },
            category: { type: String, default: "" },
            description: { type: String, default: "" },
            departureTime: { type: String, default: "" },
            photos: [{ type: String, default: [] }],
            price: { type: Number },
            maxPeople: { type: Number },
            departureFrom: { type: String, default: "" },
            arrivalTo: { type: String, default: "" },
          },
          bus: {
            isIncluded: { type: Boolean, default: false },
            name: { type: String, default: "" },
            category: { type: String, default: "" },
            description: { type: String, default: "" },
            departureTime: { type: String, default: "" },
            photos: [{ type: String, default: [] }],
            price: { type: Number },
            departureFrom: { type: String, default: "" },
            arrivalTo: { type: String, default: "" },
          },
          train: {
            isIncluded: { type: Boolean, default: false },
            name: { type: String, default: "" },
            category: { type: String, default: "" },
            description: { type: String, default: "" },
            departureTime: { type: String, default: "" },
            photos: [{ type: String, default: [] }],
            price: { type: Number },
            departureFrom: { type: String, default: "" },
            arrivalTo: { type: String, default: "" },
          },
          flight: {
            isIncluded: { type: Boolean, default: false },
            name: { type: String, default: "" },
            category: { type: String, default: "" },
            description: { type: String, default: "" },
            departureTime: { type: String, default: "" },
            photos: [{ type: String, default: [] }],
            price: { type: Number },
            departureFrom: { type: String, default: "" },
            arrivalTo: { type: String, default: "" },
          }
        },

      },
    ],
  },

  premiumDetails: {
    seasons: [
      {
        isAvailable: { type: Boolean, default: false },
        seasonName: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        pricing: [
          {
            day: { type: Number, default: 1 },
            price: { type: Number, default: 0 },
            rooms: { type: Number, default: 0 },
            person: { type: Number, default: 1 },
          }
        ]
      }
    ],
    cancellationPolicy: { type: String },
    highlights: { type: String },
    whatsIncluded: { type: String },
    whatsExcluded: { type: String },
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    itineraries: [
      {
        title: { type: String },
        duration: { type: String },
        photos: [{ type: String }],
        description: { type: String },
        day: { type: Number },
        meals: {
          isAvailable: { type: Boolean },
          breakfast: {
            isAvailable: { type: Boolean },
            isAvailable: { type: Boolean, default: false },
            name: { type: String, default: '' },
            photos: [{ type: String }]  // array of photo URLs
          },
          lunch: {
            isAvailable: { type: Boolean, default: false },
            name: { type: String, default: '' },
            photos: [{ type: String }]
          },
          dinner: {
            isAvailable: { type: Boolean, default: false },
            name: { type: String, default: '' },
            photos: [{ type: String }]
          }
        }
        ,
        hotel: {
          isIncluded: { type: Boolean, default: false },
          name: { type: String, default: "" },
          url: { type: String, default: "" },
          hotelCategory: [{ type: String, default: "" }],
          hotelImages: [{ type: String, default: [] }],
          roomPrice: { type: Number, default: null },
          roomCategory: { type: String, default: "" },
          roomImages: [{ type: String, default: [] }],
          location: { type: String, default: "" },
          beds: {
            doubleBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
            tripleBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
            fourBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
            fiveBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
            sixBed: {
              price: { type: String },
              extraBedPrice: { type: String },
            },
          }
        },
        activity: [{
          isIncluded: { type: Boolean, default: false },
          name: { type: String, default: "" },
          description: { type: String, default: "" },
          price: { type: String, default: "" },
          photos: [{ type: String, default: [] }]
        }],

        siteSeen: [{
          isAvailable: { type: Boolean, default: false },
          name: { type: String, default: "" },
          description: { type: String, default: "" },
          photos: [{ type: String, default: [] }]
        }],
        transportation: {
          isIncluded: { type: Boolean, default: false },
          car: {
            isIncluded: { type: Boolean, default: false },
            name: { type: String, default: "" },
            category: { type: String, default: "" },
            description: { type: String, default: "" },
            departureTime: { type: String, default: "" },
            photos: [{ type: String, default: [] }],
            price: { type: Number },
            departureFrom: { type: String, default: "" },
            arrivalTo: { type: String, default: "" },
            maxPeople: { type: Number },
          },
          bus: {
            isIncluded: { type: Boolean, default: false },
            name: { type: String, default: "" },
            category: { type: String, default: "" },
            description: { type: String, default: "" },
            departureTime: { type: String, default: "" },
            photos: [{ type: String, default: [] }],
            price: { type: Number },
            departureFrom: { type: String, default: "" },
            arrivalTo: { type: String, default: "" },
          },
          train: {
            isIncluded: { type: Boolean, default: false },
            name: { type: String, default: "" },
            category: { type: String, default: "" },
            description: { type: String, default: "" },
            departureTime: { type: String, default: "" },
            photos: [{ type: String, default: [] }],
            price: { type: Number },
            departureFrom: { type: String, default: "" },
            arrivalTo: { type: String, default: "" },
          },
          flight: {
            isIncluded: { type: Boolean, default: false },
            name: { type: String, default: "" },
            category: { type: String, default: "" },
            description: { type: String, default: "" },
            departureTime: { type: String, default: "" },
            photos: [{ type: String, default: [] }],
            price: { type: Number },
            departureFrom: { type: String, default: "" },
            arrivalTo: { type: String, default: "" },
          }
        },

      },
    ],
  },

  createdAt: { type: Date, default: Date.now },
  status: { type: String },
  reviews: [{ text: String, email: String, comment: String }],
});

const Tour = mongoose.model('Tour', tourDetailsSchema);

module.exports = Tour;
