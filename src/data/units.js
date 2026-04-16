/* ============================================================
   Units Configuration — Synced with Backend Enums
   
   Backend unit enums (from GitHub):
   - LengthUnit:      FEET, INCHES, YARDS, CENTIMETERS
   - TemperatureUnit:  CELSIUS, FAHRENHEIT, KELVIN
   - VolumeUnit:       LITRE, MILLILITRE, GALLON
   - WeightUnit:       MILLIGRAM, GRAM, KILOGRAM, POUND, TONNE

   The "value" MUST exactly match the Java enum constant name
   (these are used in getUnitName() → this.name())
   ============================================================ */

export const UNITS = {

  LENGTH: [
    { value: "FEET",        label: "Feet (ft)" },
    { value: "INCHES",      label: "Inches (in)" },
    { value: "YARDS",       label: "Yards (yd)" },
    { value: "CENTIMETERS", label: "Centimeters (cm)" }
  ],

  TEMPERATURE: [
    { value: "CELSIUS",    label: "Celsius (°C)" },
    { value: "FAHRENHEIT", label: "Fahrenheit (°F)" },
    { value: "KELVIN",     label: "Kelvin (K)" }
  ],

  VOLUME: [
    { value: "LITRE",      label: "Litre (L)" },
    { value: "MILLILITRE", label: "Millilitre (mL)" },
    { value: "GALLON",     label: "Gallon (gal)" }
  ],

  WEIGHT: [
    { value: "MILLIGRAM", label: "Milligram (mg)" },
    { value: "GRAM",      label: "Gram (g)" },
    { value: "KILOGRAM",  label: "Kilogram (kg)" },
    { value: "POUND",     label: "Pound (lb)" },
    { value: "TONNE",     label: "Tonne (t)" }
  ]
};
