import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { matchingService } from "./services/matching";
import { analyzeImpactMetrics } from "./services/openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Demo login endpoint
  app.post("/api/auth/demo-login", async (req, res) => {
    try {
      const demoUser = await storage.getUserByEmail("maria.garcia@manuchar.com");
      
      if (!demoUser) {
        return res.status(404).json({ error: "Usuario demo no encontrado" });
      }
      
      res.json({ 
        user: demoUser,
        message: "Sesión iniciada como María García (Demo)"
      });
    } catch (error) {
      console.error("Error en demo login:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  });

  // User profile routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error del servidor" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = req.body;
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al crear usuario" });
    }
  });

  // Assessment routes
  app.post("/api/assessments", async (req, res) => {
    try {
      const assessmentData = req.body;
      const assessment = await storage.createAssessment(assessmentData);
      res.status(201).json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Error al guardar evaluación" });
    }
  });

  app.get("/api/users/:userId/assessments", async (req, res) => {
    try {
      const assessments = await storage.getUserAssessments(parseInt(req.params.userId));
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener evaluaciones" });
    }
  });

  // Volunteer opportunities routes
  app.get("/api/opportunities", async (req, res) => {
    try {
      const { userId, location, type } = req.query;
      const opportunities = await storage.getOpportunities({
        location: location as string,
        type: type as string
      });
      
      // If userId is provided, generate personalized recommendations
      if (userId) {
        const user = await storage.getUser(parseInt(userId as string));
        const assessments = await storage.getUserAssessments(parseInt(userId as string));
        
        if (user) {
          const matches = await matchingService.generateMatches({
            userId: userId as string,
            userProfile: user,
            assessmentResults: assessments[0]?.results,
            opportunities
          });

          // Add match percentages to opportunities
          const opportunitiesWithMatches = opportunities.map(opp => {
            const match = matches.find(m => m.opportunityId === opp.id.toString());
            return {
              ...opp,
              matchPercentage: match?.matchPercentage || 0,
              matchReasons: match?.reasons || []
            };
          }).sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));

          return res.json(opportunitiesWithMatches);
        }
      }

      res.json(opportunities);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener oportunidades" });
    }
  });

  app.post("/api/opportunities", async (req, res) => {
    try {
      const opportunityData = req.body;
      const opportunity = await storage.createOpportunity(opportunityData);
      res.status(201).json(opportunity);
    } catch (error) {
      res.status(500).json({ message: "Error al crear oportunidad" });
    }
  });

  // Participation routes
  app.post("/api/participations", async (req, res) => {
    try {
      const participationData = req.body;
      const participation = await storage.createParticipation(participationData);
      
      // Update opportunity volunteer count
      await storage.updateOpportunityVolunteers(participationData.opportunityId);
      
      res.status(201).json(participation);
    } catch (error) {
      res.status(500).json({ message: "Error al unirse al proyecto" });
    }
  });

  app.get("/api/users/:userId/participations", async (req, res) => {
    try {
      const participations = await storage.getUserParticipations(parseInt(req.params.userId));
      res.json(participations);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener participaciones" });
    }
  });

  // Stats and analytics routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener estadísticas" });
    }
  });

  app.get("/api/admin/impact-analysis", async (req, res) => {
    try {
      const participations = await storage.getAllParticipations();
      const opportunities = await storage.getOpportunities({});
      
      // Generate AI-powered impact analysis
      const analysis = await analyzeImpactMetrics(participations, opportunities);
      res.json(analysis);
    } catch (error) {
      console.error('Impact analysis error:', error);
      res.status(500).json({ message: "Error al analizar impacto" });
    }
  });

  // Badge routes
  app.get("/api/users/:userId/badges", async (req, res) => {
    try {
      const badges = await storage.getUserBadges(parseInt(req.params.userId));
      res.json(badges);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener insignias" });
    }
  });

  // Notification routes
  app.get("/api/users/:userId/notifications", async (req, res) => {
    try {
      const notifications = await storage.getUserNotifications(parseInt(req.params.userId));
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener notificaciones" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error al marcar notificación" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
