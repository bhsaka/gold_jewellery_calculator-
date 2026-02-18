
export const BANKS = [
  "Union Bank of India",
  "Canara Bank",
  "UCO Bank",
  "IOB Bank",
  "Punjab National Bank",
  "State Bank of India",
  "Bank of Baroda",
  "IDBI Bank",
  "Indian Bank",
  "ICICI Bank",
  "Other Bank"
];

export const ARTICLES = [
  "Necklace",
  "Haram",
  "Chain",
  "Chain with locket",
  "Rings",
  "Black Beads",
  "Ear rings",
  "Vanki",
  "Vaddanam",
  "Matees",
  "Bracelet",
  "Chadraharam",
  "Palakasarlu",
  "Thadu",
  "Earring with Matees",
  "Other Item"
];

export const TOUCH_PERCENT_OPTIONS = [75, 80, 85, 90, 91, 92, 95];

export const KARAT_OPTIONS = [
  { label: "22krt", value: 22 },
  { label: "21krt", value: 19.25 }, // 21/22 * 22 = 21, but formula uses touch. Simplified to label
  { label: "20krt", value: 18.3348 },
  { label: "19krt", value: 17.4174 },
  { label: "18krt", value: 16.5 }
];

// Mapping for Net Weight Formula based on your prompt:
// 22krt = 100% (Touch 100)
// 21krt = 87.50%
// 20krt = 83.34%
// 19krt = 79.17%
// 18krt = 75.00%
export const KARAT_MAP: Record<string, number> = {
  "22krt": 100,
  "21krt": 87.50,
  "20krt": 83.34,
  "19krt": 79.17,
  "18krt": 75.00
};
