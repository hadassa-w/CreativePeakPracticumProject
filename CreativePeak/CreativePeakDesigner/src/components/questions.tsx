import { Grid, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQAccordion = () => {
  const faqs = [
    {
      question: "Is there really a free plan?",
      answer: "Yes! You can start with our free plan that includes basic portfolio features and up to 5 projects. It's perfect for beginners or those who want to try the platform."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Absolutely! You can upgrade or downgrade your subscription at any time. Your billing will be adjusted accordingly for the next payment period."
    },
    {
      question: "How do clients find me?",
      answer: "CreativePeak has a designer directory where clients can search for specific design skills. Our Pro and Business plans include SEO optimization to improve your visibility."
    },
    {
      question: "Is my data secure?",
      answer: "We take security seriously. All your portfolio data is encrypted and stored securely. You retain full rights to all content you upload to the platform."
    }
  ];

  return (
    <Grid container spacing={3} justifyContent="center">
      {faqs.map((faq, index) => (
        <Grid item xs={12} md={8} key={index}>
          <Accordion
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              "&:before": { display: "none" },
              transition: "all 0.3s ease-in-out",
              "&.Mui-expanded": {
                bgcolor: "rgba(81,45,168,0.08)"
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#512da8", fontSize: 28 }} />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{
                px: 3,
                py: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "600",
                  color: "#512da8",
                  width: "100%",
                  textAlign: "center",
                  transition: "color 0.3s",
                  ".Mui-expanded &": {
                    color: "#311b92"
                  }
                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                px: 3,
                pb: 2,
                textAlign: "center",
                color: "#666",
                fontSize: "0.95rem",
                transition: "all 0.3s ease"
              }}
            >
              {faq.answer}
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  );
};

export default FAQAccordion;
