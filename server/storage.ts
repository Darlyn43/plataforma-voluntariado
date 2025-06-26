import {
  type User,
  type InsertUser,
  type PsychologicalAssessment,
  type InsertAssessment,
  type VolunteerOpportunity,
  type InsertOpportunity,
  type Participation,
  type InsertParticipation,
  type Badge,
  type UserBadge,
  type Notification
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<PsychologicalAssessment>;
  getUserAssessments(userId: number): Promise<PsychologicalAssessment[]>;
  getAssessmentsByType(userId: number, testType: string): Promise<PsychologicalAssessment[]>;
  getOpportunities(filters: { location?: string; type?: string; isActive?: boolean }): Promise<VolunteerOpportunity[]>;
  getOpportunity(id: number): Promise<VolunteerOpportunity | undefined>;
  createOpportunity(opportunity: InsertOpportunity): Promise<VolunteerOpportunity>;
  updateOpportunity(id: number, updates: Partial<VolunteerOpportunity>): Promise<VolunteerOpportunity | undefined>;
  updateOpportunityVolunteers(opportunityId: number): Promise<void>;
  createParticipation(participation: InsertParticipation): Promise<Participation>;
  getUserParticipations(userId: number): Promise<Participation[]>;
  getOpportunityParticipations(opportunityId: number): Promise<Participation[]>;
  getAllParticipations(): Promise<Participation[]>;
  updateParticipation(id: number, updates: Partial<Participation>): Promise<Participation | undefined>;
  getUserBadges(userId: number): Promise<UserBadge[]>;
  getAllBadges(): Promise<Badge[]>;
  awardBadge(userId: number, badgeId: number): Promise<UserBadge>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: Omit<Notification, "id" | "createdAt">): Promise<Notification>;
  markNotificationAsRead(notificationId: number): Promise<void>;
  getAdminStats(): Promise<{
    activeVolunteers: number;
    totalHours: number;
    activeProjects: number;
    peopleImpacted: number;
    departmentStats: Array<{ department: string; count: number; hours: number }>;
    sdgStats: Array<{ sdg: string; projects: number; hours: number }>;
  }>;
}

export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private assessments = new Map<number, PsychologicalAssessment>();
  private opportunities = new Map<number, VolunteerOpportunity>();
  private participations = new Map<number, Participation>();
  private badges = new Map<number, Badge>();
  private userBadges = new Map<number, UserBadge>();
  private notifications = new Map<number, Notification>();

  private currentUserId = 1;
  private currentAssessmentId = 1;
  private currentOpportunityId = 1;
  private currentParticipationId = 1;
  private currentBadgeId = 1;
  private currentUserBadgeId = 1;
  private currentNotificationId = 1;

  constructor() {
    // Ya no se carga el demo automáticamente
    // Si quieres activarlo para pruebas, puedes llamar a:
    // this.initializeDefaultData();
  }

  
  public initializeDefaultData() {
    console.warn("⚠️ Datos demo inicializados manualmente (solo para pruebas)");
    
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.firebaseUid === firebaseUid);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = {
      ...user,
      id,
      role: user.role || "employee",
      isFirstLogin: user.isFirstLogin ?? true,
      profileCompleted: user.profileCompleted ?? false,
      testsCompleted: user.testsCompleted ?? false,
      interests: user.interests || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createAssessment(assessment: InsertAssessment): Promise<PsychologicalAssessment> {
    const id = this.currentAssessmentId++;
    const newAssessment: PsychologicalAssessment = { ...assessment, id, completedAt: new Date() };
    this.assessments.set(id, newAssessment);
    return newAssessment;
  }

  async getUserAssessments(userId: number): Promise<PsychologicalAssessment[]> {
    return Array.from(this.assessments.values()).filter(a => a.userId === userId);
  }

  async getAssessmentsByType(userId: number, testType: string): Promise<PsychologicalAssessment[]> {
    return Array.from(this.assessments.values()).filter(a => a.userId === userId && a.testType === testType);
  }

  async getOpportunities(filters: { location?: string; type?: string; isActive?: boolean }): Promise<VolunteerOpportunity[]> {
    let opps = Array.from(this.opportunities.values());
    if (filters.location) {
      opps = opps.filter(o => o.location === filters.location || o.location === "Remoto");
    }
    if (filters.type) {
      opps = opps.filter(o => o.type === filters.type);
    }
    if (filters.isActive !== undefined) {
      opps = opps.filter(o => o.isActive === filters.isActive);
    }
    return opps;
  }

  async getOpportunity(id: number): Promise<VolunteerOpportunity | undefined> {
    return this.opportunities.get(id);
  }

  async createOpportunity(opportunity: InsertOpportunity): Promise<VolunteerOpportunity> {
    const id = this.currentOpportunityId++;
    const newOpp: VolunteerOpportunity = {
      ...opportunity,
      id,
      currentVolunteers: 0,
      createdAt: new Date(),
      skills: opportunity.skills || [],
      sdgs: opportunity.sdgs || [],
      isActive: opportunity.isActive ?? true
