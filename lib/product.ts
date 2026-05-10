export type Testimonial = {
  quote: string;
  name: string;
  location: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export const product = {
  brandName: "FaithWear Nepal",
  name: "Custom Name Print T-Shirt",
  displayName: "Christian Bible Verse Print T-Shirt",
  headline: "Wear your faith with confidence and modern style.",
  subheadline:
    "Premium Christian-inspired T-shirts designed for daily wear, church, gifts, and meaningful moments.",
  description:
    "Our Christian Bible Verse Print T-Shirt is made for people who want to wear their faith with confidence. It comes with beautiful inspirational Bible verse designs, comfortable fabric, and a clean modern look for daily wear, church, events, gifts, and special occasions. Choose your favorite design and order easily with Cash on Delivery.",
  regularPrice: 1499,
  offerPrice: 999,
  deliveryFee: 0,
  comboDiscountQuantity: 3,
  comboDiscountPercent: 10,
  currency: "Rs.",
  colorTheme: "Black and gold premium with clean white sections",
  sheetTabName: "T-shirt order",
  businessEmail: "batch18th1990@gmail.com",
  replyToEmail: "batch18th1990@gmail.com",
  images: [
    "/products/product-1.png",
    "/products/product-2.png",
    "/products/product-3.png",
    "/products/product-4.png",
    "/products/product-5.png",
  ],
  benefits: [
    "Comfortable and soft fabric for daily wear",
    "Inspirational Christian Bible verse designs",
    "Perfect for church, events, gifts, and casual outfits",
    "Stylish design that helps customers express their faith",
    "Easy to order with Cash on Delivery",
    "Available in different colors, sizes, and designs",
  ],
  testimonials: [
    {
      quote:
        "The T-shirt quality is very good and comfortable. I loved the Bible verse design. It looks stylish and meaningful.",
      name: "Anita Rai",
      location: "Kathmandu",
    },
    {
      quote:
        "I ordered this as a gift and the person really liked it. The print is clear, the fabric feels nice, and delivery was easy.",
      name: "Samuel Tamang",
      location: "Pokhara",
    },
    {
      quote:
        "Perfect T-shirt for daily wear and church. The design is beautiful and the Cash on Delivery option made ordering simple.",
      name: "Prakash Magar",
      location: "Chitwan",
    },
  ] satisfies Testimonial[],
  faqs: [
    {
      question: "What sizes are available?",
      answer: "We offer different sizes such as S, M, L, XL, and XXL.",
    },
    {
      question: "What is the T-shirt made of?",
      answer:
        "The T-shirt is made with comfortable and soft fabric suitable for daily wear.",
    },
    {
      question: "Can I choose my favorite Bible verse design?",
      answer: "Yes, you can choose your favorite design from the available options.",
    },
    {
      question: "Is Cash on Delivery available?",
      answer: "Yes, Cash on Delivery is available for easy ordering.",
    },
    {
      question: "How many days does delivery take?",
      answer: "Delivery usually takes 2-5 days depending on your location.",
    },
    {
      question: "Can I order 2 T-shirts as a combo offer?",
      answer: "Yes, you can order 2 T-shirts under the special combo offer.",
    },
    {
      question: "Is this T-shirt good for gifts?",
      answer:
        "Yes, it is perfect for gifts, church events, birthdays, and special occasions.",
    },
  ] satisfies Faq[],
};

export function formatMoney(amount: number) {
  return `${product.currency} ${amount.toLocaleString("en-IN")}`;
}

export function getOrderTotal(quantity: number) {
  const subtotal = product.offerPrice * quantity;
  const discount =
    quantity >= product.comboDiscountQuantity
      ? Math.round((subtotal * product.comboDiscountPercent) / 100)
      : 0;

  return {
    subtotal,
    discount,
    deliveryFee: product.deliveryFee,
    total: subtotal - discount + product.deliveryFee,
  };
}
