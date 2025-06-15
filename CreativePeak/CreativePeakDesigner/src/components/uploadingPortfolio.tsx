import { Button, CircularProgress, styled } from "@mui/material";
import { useEffect, useState } from "react";
import Category from "../models/category";
import DesignerDetails from "../models/designerDetails";
import axios from "axios";
import Image from "../models/image";
import AutoSnackbar from "./snackbar";
import { useAuth } from "../contexts/authContext";

const StyledButton = styled(Button)({
    textTransform: "none",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "10px",
    padding: "8px 16px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
})

const UploadProfolio = () => {
    const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [images, setImages] = useState<Image[]>([])
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")
    const { userId, token } = useAuth()

    useEffect(() => {
        Promise.all([
            axios.get(`https://creativepeak-api.onrender.com/api/Image`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ),
            axios.get(`https://creativepeak-api.onrender.com/api/Category`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ),
        ])
            .then(([imagesResponse, categoriesResponse]) => {
                const filteredImages = imagesResponse.data.filter((image: Image) => image.user.id == userId)
                const filteredCategories = categoriesResponse.data.filter((category: Category) => category.userId == userId)

                setImages(filteredImages)
                setCategories(filteredCategories)
            })
            .catch((error) => {
                console.error("Error while retrieving data:", error)
                setSnackbarMessage("❌ Error loading projects and categories. Please try again later.")
                setSnackbarSeverity("error")
                setSnackbarOpen(true)
            })
    }, [userId])

    const generatePortfolioHTML = async () => {
        setIsGeneratingPortfolio(true)

        try {
            Promise.all([
                axios.get(`https://creativepeak-api.onrender.com/api/Image`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ),
                axios.get(`https://creativepeak-api.onrender.com/api/Category`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ),
            ])
                .then(([imagesResponse, categoriesResponse]) => {
                    const filteredImages = imagesResponse.data.filter((image: Image) => image.user.id == userId)
                    const filteredCategories = categoriesResponse.data.filter((category: Category) => category.userId == userId)

                    setImages(filteredImages)
                    setCategories(filteredCategories)
                })
                .catch((error) => {
                    console.error("Error while retrieving data:", error)
                    setSnackbarMessage("❌ Error loading. Please try again later.")
                    setSnackbarSeverity("error")
                    setSnackbarOpen(true)
                })

            const userResponse = await axios.get(`https://creativepeak-api.onrender.com/api/DesignerDetails`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            const userInfo = userResponse.data.find((designerDetails: DesignerDetails) => designerDetails.userId == userId);

            let htmlContent = ``
            if (userInfo) {
                htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Portfolio - ${userInfo.fullName || 'Graphic Designer'}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }

            .container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 20px;
            }

            .header {
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(15px);
                border-radius: 25px;
                padding: 50px;
                text-align: center;
                margin-bottom: 40px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                position: relative;
                overflow: hidden;
            }

            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 5px;
                background: linear-gradient(45deg, #9C27B0, #673AB7, #3F51B5, #2196F3);
            }

            .profile-section {
                margin-bottom: 40px;
            }

            .profile-avatar {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                margin: 0 auto 20px;
                background: linear-gradient(45deg, #9C27B0, #673AB7);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
                color: white;
                font-weight: bold;
                box-shadow: 0 10px 25px rgba(156, 39, 176, 0.3);
            }

            .profile-name {
                font-size: 3.5em;
                font-weight: 800;
                background: linear-gradient(45deg, #9C27B0, #673AB7);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 15px;
                letter-spacing: -1px;
            }

            .profile-title {
                font-size: 1.8em;
                color: #666;
                margin-bottom: 20px;
                font-style: italic;
                font-weight: 300;
            }

            .contact {
                font-size: 20px;
                color: #666;
                font-weight: bold;
            }

            .profile-description {
                font-size: 1.2em;
                color: #777;
                max-width: 800px;
                margin: 0 auto 15px;
                line-height: 1.5;
            }

            .contact-info {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 25px;
                margin: 40px 0;
                padding: 0 20px;
            }

            .contact-item {
                display: flex;
                align-items: center;
                gap: 18px;
                background: rgba(255, 255, 255, 0.95);
                padding: 25px 30px;
                border-radius: 20px;
                color: #333;
                font-weight: 600;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 2px solid rgba(156, 39, 176, 0.1);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(15px);
                cursor: pointer;
                text-decoration: none;
                position: relative;
                overflow: hidden;
            }

            .contact-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(156, 39, 176, 0.1), transparent);
                transition: left 0.6s;
            }

            .contact-item:hover::before {
                left: 100%;
            }

            .contact-item:hover {
                background: rgba(156, 39, 176, 0.08);
                border-color: rgba(156, 39, 176, 0.4);
                transform: translateY(-5px) scale(1.02);
                box-shadow: 0 15px 35px rgba(156, 39, 176, 0.2);
            }

            .contact-item:active {
                transform: translateY(-3px) scale(1.01);
            }

            .contact-icon {
                font-size: 22px;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #9C27B0, #673AB7);
                border-radius: 15px;
                color: white;
                flex-shrink: 0;
                box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
                transition: all 0.3s ease;
            }

            .contact-item:hover .contact-icon {
                transform: rotate(5deg) scale(1.1);
                box-shadow: 0 6px 20px rgba(156, 39, 176, 0.4);
            }

            .contact-content {
                flex-grow: 1;
            }

            .contact-label {
                font-size: 0.9em;
                color: #999;
                text-transform: none;
                letter-spacing: 1px;
                margin-bottom: 5px;
                font-weight: 500;
            }

            .contact-text {
                font-size: 1.15em;
                color: #333;
                font-weight: 700;
                word-break: break-all;
            }

            .contact-arrow {
                font-size: 18px;
                color: #9C27B0;
                transition: all 0.3s ease;
                opacity: 0.7;
            }

            .contact-item:hover .contact-arrow {
                transform: translateX(5px);
                opacity: 1;
            }
            
            .stats {
                display: flex;
                justify-content: center;
                gap: 35px;
                margin-top: 50px;
                flex-wrap: wrap;
            }

            .stat-item {
                text-align: center;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.9) 100%);
                padding: 40px 35px;
                border-radius: 25px;
                min-width: 200px;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 3px solid rgba(156, 39, 176, 0.1);
                backdrop-filter: blur(20px);
                position: relative;
                overflow: hidden;
            }

            .stat-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 5px;
                background: linear-gradient(45deg, #9C27B0, #673AB7, #3F51B5);
            }

            .stat-item::after {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(156, 39, 176, 0.05), transparent);
                transform: rotate(45deg);
                transition: all 0.6s ease;
                opacity: 0;
            }

            .stat-item:hover::after {
                opacity: 1;
                animation: shimmer 2s infinite;
            }

            @keyframes shimmer {
                0% { transform: rotate(45deg) translateX(-100%); }
                100% { transform: rotate(45deg) translateX(100%); }
            }

            .stat-item:hover {
                transform: translateY(-10px) scale(1.05);
                box-shadow: 0 25px 50px rgba(156, 39, 176, 0.25);
                border-color: rgba(156, 39, 176, 0.3);
            }

            .stat-number {
                font-size: 4em;
                font-weight: 900;
                background: linear-gradient(45deg, #9C27B0, #673AB7);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                line-height: 1;
                margin-bottom: 15px;
                transition: all 0.3s ease;
            }

            .stat-item:hover .stat-number {
                transform: scale(1.1);
            }

            .stat-label {
                color: #666;
                margin-top: 15px;
                font-weight: 700;
                text-transform: none;
                letter-spacing: 2px;
                font-size: 1em;
                position: relative;
            }

            .stat-label::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 40px;
                height: 3px;
                background: linear-gradient(45deg, #9C27B0, #673AB7);
                border-radius: 2px;
                transition: width 0.3s ease;
            }

            .stat-item:hover .stat-label::after {
                width: 60px;
            }
            
            .category-section {
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(15px);
                border-radius: 25px;
                padding: 50px;
                margin-bottom: 40px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                position: relative;
                overflow: hidden;
            }

            .category-section::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(45deg, #9C27B0, #673AB7);
            }

            .category-title {
                font-size: 2.8em;
                font-weight: 800;
                background: linear-gradient(45deg, #9C27B0, #673AB7);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 20px;
                position: relative;
                display: inline-block;
            }

            .category-title::after {
                content: '';
                position: absolute;
                bottom: -15px;
                left: 0;
                width: 120px;
                height: 4px;
                background: linear-gradient(45deg, #9C27B0, #673AB7);
                border-radius: 2px;
            }

            .category-description {
                font-size: 1.3em;
                color: #666;
                margin-bottom: 40px;
                font-style: italic;
                line-height: 1.6;
            }

            .projects-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 35px;
            }

            .project-card {
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
            }

            .project-card:hover {
                transform: translateY(-15px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            }

            .project-image {
                width: 100%;
                height: 280px;
                object-fit: cover;
                cursor: pointer;
                transition: transform 0.5s ease;
                position: relative;
            }

            .project-card:hover .project-image {
                transform: scale(1.08);
            }

            .image-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%);
                opacity: 0;
                transition: opacity 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
                font-weight: bold;
            }

            .project-card:hover .image-overlay {
                opacity: 1;
            }

            .project-content {
                padding: 30px;
            }

            .project-title {
                font-size: 1.5em;
                font-weight: 700;
                color: #333;
                margin-bottom: 15px;
                line-height: 1.3;
            }

            .project-description {
                color: #666;
                margin-bottom: 20px;
                line-height: 1.7;
                font-size: 1.05em;
            }

            .project-meta {
                display: flex;
                justify-content: space-between;
                font-size: 0.9em;
                color: #999;
                border-top: 1px solid #eee;
                padding-top: 20px;
                margin-top: 20px;
            }

            .project-date {
                background: rgba(156, 39, 176, 0.1);
                padding: 5px 12px;
                border-radius: 15px;
                color: #9C27B0;
            }

            .footer {
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(15px);
                border-radius: 25px;
                padding: 40px;
                text-align: center;
                margin-top: 50px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            }

            .footer-text {
                color: #666;
                font-size: 1.2em;
                margin-bottom: 10px;
            }

            .generated-date {
                color: #999;
                font-size: 1em;
                margin-top: 15px;
            }

            .back-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: linear-gradient(45deg, #9C27B0, #673AB7);
                color: white;
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                font-size: 15px;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(156, 39, 176, 0.4);
                transition: all 0.3s ease;
                opacity: 0;
                visibility: hidden;
                z-index: 100;
            }

            .back-to-top.visible {
                opacity: 1;
                visibility: visible;
            }

            .back-to-top:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(156, 39, 176, 0.6);
            }

            /* Enhanced Modal Styles */
            .image-modal {
                display: none;
                position: fixed;
                z-index: 2000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.7);
                cursor: pointer;
                backdrop-filter: blur(2px);
                animation: fadeIn 0.3s ease-in-out;
            }

            .image-modal.active {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from { 
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to { 
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            .modal-content {
                max-width: 95vw;
                max-height: 85vh;
                width: auto;
                height: auto;
                object-fit: contain;
                border-radius: 15px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
                animation: fadeIn 0.3s ease-in-out;
                cursor: default;
            }

            .close-modal {
                position: absolute;
                top: 25px;
                right: 35px;
                color: white;
                font-size: 50px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 2001;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.6);
                border-radius: 50%;
                backdrop-filter: blur(10px);
            }

            .close-modal:hover {
                background: rgba(104, 104, 104, 0.68);
                transform: rotate(90deg);
            }

            .modal-navigation {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                font-size: 20px;
                padding: 20px 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                border-radius: 50%;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .modal-navigation:hover {
                background: rgba(156, 39, 176, 0.8);
                transform: translateY(-50%) scale(1.1);
            }

            .modal-nav-prev {
                left: 30px;
            }

            .modal-nav-next {
                right: 30px;
            }

            .modal-info {
                position: absolute;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                background: rgba(255, 178, 245, 0.21);
                padding: 10px 20px;
                border-radius: 15px;
                max-width: 60%;
                border: 1px solid rgba(0, 0, 0, 0.1);
                transition: max-width 0.3s ease;
            }

            .modal-info h3 {
                margin: 0 0 10px 0;
                font-size: 1.4em;
                font-weight: 700;
            }

            .modal-info p {
                margin: 0;
                opacity: 0.9;
                line-height: 1.5;
            }

            .modal-counter {
                position: absolute;
                top: 25px;
                left: 35px;
                color: white;
                background: rgba(0, 0, 0, 0.6);
                padding: 10px 20px;
                border-radius: 20px;
                font-weight: 600;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            @media (max-width: 768px) {
                .container {
                    padding: 15px;
                }

                .header {
                    padding: 30px 20px;
                }

                .profile-name {
                    font-size: 2.5em;
                }

                .profile-title {
                    font-size: 1.3em;
                }

                .contact-info {
                    grid-template-columns: 1fr;
                    gap: 20px;
                }

                .contact-item {
                    padding: 20px 25px;
                }

                .contact-icon {
                    width: 45px;
                    height: 45px;
                    font-size: 20px;
                }

                .contact-text {
                    font-size: 1.05em;
                }

                .stats {
                    flex-direction: column;
                    align-items: center;
                    gap: 25px;
                }

                .stat-item {
                    padding: 30px 25px;
                    min-width: 180px;
                }

                .stat-number {
                    font-size: 3.5em;
                }

                .category-section {
                    padding: 30px 20px;
                }

                .category-title {
                    font-size: 2.2em;
                }

                .projects-grid {
                    grid-template-columns: 1fr;
                }

                .modal-content {
                    max-width: 95%;
                    max-height: 80%;
                }

                .close-modal {
                    top: 15px;
                    right: 15px;
                    font-size: 35px;
                    width: 50px;
                    height: 50px;
                }

                .modal-navigation {
                    font-size: 25px;
                    width: 50px;
                    height: 50px;
                    padding: 15px 12px;
                }

                .modal-nav-prev {
                    left: 15px;
                }

                .modal-nav-next {
                    right: 15px;
                }

                .modal-counter {
                    top: 15px;
                    left: 15px;
                    font-size: 0.9em;
                    padding: 8px 15px;
                }

                .modal-info {
                    bottom: 20px;
                    padding: 15px 20px;
                    max-width: 90%;
                }

                .modal-info h3 {
                    font-size: 1.2em;
                }
            }
                
            #toggleDescBtn {
                margin-top: 10px;
                background: rgba(154, 154, 154, 0.2);
                border: none;
                padding: 8px 15px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                transition: 0.3s;
                }

            #toggleDescBtn:hover {
                background: rgba(198, 198, 198, 0.4);
            }

        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header Section -->
            <div class="header">
                <div class="profile-section">
                    <div class="profile-avatar">
                        ${userInfo.fullName?.charAt(0).toUpperCase() || 'D'}
                    </div>
                    <h1 class="profile-name">${userInfo.fullName || 'Professional Graphic Designer'}</h1>
                    <p class="profile-title">Creative Designer & Visual Artist</p>
                    <p class="profile-description">
                        ${userInfo.description}
                    </p>
                    
                    <p class="contact">Contact Info:</p>

                    <div class="contact-info">
                        ${userInfo.email ? `
                            <a href="mailto:${userInfo.email}" class="contact-item">
                                <span class="contact-icon">📧</span>
                                <div class="contact-content">
                                    <div class="contact-label">Email</div>
                                    <div class="contact-text">${userInfo.email}</div>
                                </div>
                                <span class="contact-arrow">→</span>
                            </a>
                        ` : ''}
                        ${userInfo.addressSite ? `
                            <a href="${userInfo.addressSite.startsWith('http') ? userInfo.addressSite : 'https://' + userInfo.addressSite}" target="_blank" class="contact-item">
                                <span class="contact-icon">🌐</span>
                                <div class="contact-content">
                                    <div class="contact-label">Website</div>
                                    <div class="contact-text">${userInfo.addressSite}</div>
                                </div>
                                <span class="contact-arrow">→</span>
                            </a>
                        ` : ''}
                        ${userInfo.phone ? `
                            <a href="tel:${userInfo.phone}" class="contact-item">
                                <span class="contact-icon">📱</span>
                                <div class="contact-content">
                                    <div class="contact-label">Phone</div>
                                    <div class="contact-text">${userInfo.phone}</div>
                                </div>
                                <span class="contact-arrow">→</span>
                            </a>
                        ` : ''}
                        ${userInfo.location ? `
                            <a href="https://maps.google.com/?q=${encodeURIComponent(userInfo.location)}" target="_blank" class="contact-item">
                                <span class="contact-icon">📍</span>
                                <div class="contact-content">
                                    <div class="contact-label">Location</div>
                                    <div class="contact-text">${userInfo.location}</div>
                                </div>
                                <span class="contact-arrow">→</span>
                            </a>
                        ` : ''}
                    </div>
                </div>

                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-number">${userInfo.yearsExperience || 0}</div>
                        <div class="stat-label">Years experience</div>
                    </div>
                </div>
            </div>

            <!-- Portfolio Content -->
        ${categories.map(category => {
                    const categoryImages = images
                        .filter(img => img.category.id === category.id)
                        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

                    if (categoryImages.length === 0) return '';

                    return `
            <div class="category-section" id="category-${category.id}">
                <h2 class="category-title">${category.categoryName}</h2>
                <div class="projects-grid">
                    ${categoryImages.map((image, index) => `
                        <div class="project-card">
                            <div class="project-image-wrapper">
                                <img src="${image.linkURL}" alt="${image.fileName}" class="project-image" loading="lazy"
                                     onclick="openModal(${JSON.stringify(categoryImages).replace(/"/g, '&quot;')}, ${index})">
                            </div>
                            <div class="project-content">
                                <h3 class="project-title">${image.fileName}</h3>
                                ${image.description ? `<p class="project-description">${image.description}</p>` : ''}
                                    <div class="project-meta">
                                        <span class="project-date"><span style="font-weight: 600;">Created:</span> ${new Date(image.createdAt).toLocaleDateString('he-IL')}</span>
                                        <span class="project-date"><span style="font-weight: 600;">Updated:</span> ${new Date(image.updatedAt).toLocaleDateString('he-IL')}</span>
                                    </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            `;
                }).join('')}

            <!-- Footer -->
            <div class="footer">
                <p class="footer-text">Professional Portfolio - ${userInfo.fullName || 'Graphic Designer'}</p>
                <p style="color: #9C27B0; font-weight: 600; margin: 10px 0;">
                    Creating Visual Excellence Through Design
                </p>
                            <p>Creating with 
                <a href="https://creativepeak-designer.onrender.com" target="_blank" style="color: #9C27B0; text-decoration: none; font-weight: 600;">
                CreativePeak Designer</a>
                </p>
                <p class="generated-date">Generated on: ${new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</p>
            </div>
        </div>

        <!-- Back to Top Button -->
        <button class="back-to-top" onclick="scrollToTop()" id="backToTop">↑</br>Contact</button>

        <!-- Enhanced Image Modal -->
        <div id="imageModal" class="image-modal">
            <div class="modal-content-wrapper">
                <button class="close-modal" onclick="closeModal()" aria-label="Cancel">&times;</button>
                <button class="modal-navigation modal-nav-next" onclick="previousImage()" aria-label="Prev project">›</button>
                <img class="modal-content" id="modalImage" alt="">
                <button class="modal-navigation modal-nav-prev" onclick="nextImage()" aria-label="Next project">‹</button>
                <div class="modal-info" id="modalInfo">
                    <h3 id="modalTitle"></h3>
                    <button onclick="toggleDescription()" id="toggleDescBtn">Show Description</button>
                    <p id="modalDescription" style="display: none;"></p>
                </div>
            </div>
        </div>

        <script>
        let currentImages = [];
        let currentImageIndex = 0;
        let zoomLevel = 1;
        let isDragging = false;
        let startX = 0, startY = 0;
        let translateX = 0, translateY = 0;
        const modalImg = document.getElementById('modalImage');

        function openModal(images, index) {
            currentImages = images;
            currentImageIndex = index;
            resetZoomAndPosition();
            showModalImage();
            
            const modal = document.getElementById('imageModal');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            preloadAdjacentImages();
        }

        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

function toggleDescription() {
  const desc = document.getElementById('modalDescription');
  const btn = document.getElementById('toggleDescBtn');
  const modalInfo = document.getElementById('modalInfo');

  if (desc.style.display === 'none') {
    desc.style.display = 'block';
    btn.textContent = 'Hide Description';
    modalInfo.style.maxWidth = '80%';
  } else {
    desc.style.display = 'none';
    btn.textContent = 'Show Description';
    modalInfo.style.maxWidth = '40%';
  }
}

        window.addEventListener('scroll', function() {
            const backToTop = document.getElementById('backToTop');
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        function showModalImage() {
            if (currentImages.length === 0) return;

            const image = currentImages[currentImageIndex];
            
            modalImg.src = image.linkURL;
            modalImg.alt = image.fileName;
            document.getElementById('modalTitle').textContent = image.fileName;
            document.getElementById('modalDescription').textContent = image.description || '';

            const prevBtn = document.querySelector('.modal-nav-prev');
            const nextBtn = document.querySelector('.modal-nav-next');

            if (currentImageIndex === 0) {
                prevBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
            }

            if (currentImageIndex === currentImages.length - 1) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'flex';
            }
        }

        function closeModal() {
            const modal = document.getElementById('imageModal');
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function previousImage() {
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : currentImages.length - 1;
            resetZoomAndPosition();
            showModalImage();
        }

        function nextImage() {
            currentImageIndex = (currentImageIndex < currentImages.length - 1) ? currentImageIndex + 1 : 0;
            resetZoomAndPosition();
            showModalImage();
        }

        function resetZoomAndPosition() {
            zoomLevel = 1;
            translateX = 0;
            translateY = 0;
            updateImageTransform();
        }

        function updateImageTransform() {
            modalImg.style.transform = \`translate(\${translateX}px, \${translateY}px) scale(\${zoomLevel})\`;
            modalImg.style.cursor = zoomLevel > 1 ? 'grab' : 'zoom-in';
        }

        function preloadAdjacentImages() {
            const nextIndex = (currentImageIndex + 1) % currentImages.length;
            const prevIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
            if (nextIndex !== currentImageIndex) new Image().src = currentImages[nextIndex].linkURL;
            if (prevIndex !== currentImageIndex) new Image().src = currentImages[prevIndex].linkURL;
        }

        document.addEventListener('keydown', (e) => {
            if (document.getElementById('imageModal').classList.contains('active')) {
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowRight' && currentImageIndex < currentImages.length - 1) nextImage(); 
                if (e.key === 'ArrowLeft' && currentImageIndex > 0) previousImage(); 
            }
        });

        modalImg.addEventListener('wheel', e => {
            e.preventDefault();
            const scaleAmount = e.deltaY > 0 ? -0.1 : 0.1;
            zoomLevel = Math.max(1, Math.min(3, zoomLevel + scaleAmount));
            updateImageTransform();
        });

        modalImg.addEventListener('mousedown', e => {
            if (zoomLevel > 1) {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                modalImg.style.cursor = 'grabbing';
            }
        });

        window.addEventListener('mousemove', e => {
            if (isDragging) {
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateImageTransform();
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            if(zoomLevel > 1) modalImg.style.cursor = 'grab';
        });

        modalImg.addEventListener('dblclick', () => {
            zoomLevel = zoomLevel > 1 ? 1 : 2;
            if (zoomLevel === 1) { translateX = 0; translateY = 0; }
            updateImageTransform();
        });

            document.addEventListener('DOMContentLoaded', function() {
                const modal = document.getElementById('imageModal');
                
                modal.addEventListener('click', function(event) {
                    if (event.target === modal) {
                        closeModal();
                    }
                });
            });

        </script>
    </body>
    </html>import React, { useState } from 'react';
`;
            }

            if (htmlContent) {
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${userInfo.fullName || 'portfolio'}_portfolio.html`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                setSnackbarMessage("🎉 Portfolio generated and downloaded successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            }
            else {
                setSnackbarMessage("❌ No graphic designer details or images were found to create the portfolio.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Error generating portfolio:", error);
            setSnackbarMessage("❌ Error generating portfolio. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setIsGeneratingPortfolio(false);
        }
    };

    const PortfolioButton = styled(StyledButton)({
        background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
        color: "white",
        "&:hover": {
            background: "linear-gradient(45deg, #FF5252 30%, #FF7043 90%)",
        },
        "&:disabled": {
            background: "linear-gradient(45deg, #BDBDBD 30%, #9E9E9E 90%)",
            color: "white",
        },
    });

    return <>
        <PortfolioButton
            variant="contained"
            onClick={generatePortfolioHTML}
            disabled={isGeneratingPortfolio}
        >
            {isGeneratingPortfolio ? (
                <>
                    <CircularProgress size={20} sx={{ color: "white", marginRight: "8px" }} />
                    📥 Generating Portfolio...
                </>
            ) : (
                <>
                    🗂️ Download Portfolio
                </>
            )}
        </PortfolioButton>

        <AutoSnackbar
            open={snackbarOpen}
            message={snackbarMessage}
            severity={snackbarSeverity}
            onClose={() => setSnackbarOpen(false)}
        />

    </>

}

export default UploadProfolio;