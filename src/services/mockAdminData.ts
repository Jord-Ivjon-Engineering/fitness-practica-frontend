import type {
  AdminUser,
  AdminTransaction,
  DashboardStats,
  TrainingProgram,
  CreateUserData,
  CreateProgramData,
} from './api';

const STORAGE_KEY = 'fp_admin_mock';

interface ProgramVideo {
  id: number;
  programId: number;
  url: string;
  title: string | null;
  createdAt: string;
}

interface MockStore {
  users: AdminUser[];
  transactions: AdminTransaction[];
  programs: TrainingProgram[];
  videos: ProgramVideo[];
  nextUserId: number;
  nextTransactionId: number;
  nextProgramId: number;
  nextVideoId: number;
}

const timestamp = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

const defaultStore = (): MockStore => ({
  users: [
    {
      id: 1,
      email: 'admin@fitnesspractica.com',
      name: 'Admin User',
      phone: '+355691234567',
      role: 'admin',
      createdAt: timestamp(90),
      updatedAt: timestamp(1),
      _count: { payments: 0, programs: 0 },
    },
    {
      id: 2,
      email: 'ana.hoxha@email.com',
      name: 'Ana Hoxha',
      phone: '+355682223344',
      role: 'member',
      createdAt: timestamp(45),
      updatedAt: timestamp(10),
      _count: { payments: 2, programs: 1 },
    },
    {
      id: 3,
      email: 'marko.dervishi@email.com',
      name: 'Marko Dervishi',
      phone: '+355693334455',
      role: 'member',
      createdAt: timestamp(20),
      updatedAt: timestamp(5),
      _count: { payments: 1, programs: 1 },
    },
  ],
  transactions: [
    {
      id: 1,
      userName: 'Ana Hoxha',
      userEmail: 'ana.hoxha@email.com',
      amount: 4500,
      currency: 'all',
      status: 'completed',
      itemName: 'Weight Loss Program',
      itemType: 'program',
      createdAt: timestamp(12),
      updatedAt: timestamp(12),
    },
    {
      id: 2,
      userName: 'Ana Hoxha',
      userEmail: 'ana.hoxha@email.com',
      amount: 3500,
      currency: 'all',
      status: 'completed',
      itemName: 'Flexibility & Yoga',
      itemType: 'program',
      createdAt: timestamp(30),
      updatedAt: timestamp(30),
    },
    {
      id: 3,
      userName: 'Marko Dervishi',
      userEmail: 'marko.dervishi@email.com',
      amount: 5000,
      currency: 'all',
      status: 'completed',
      itemName: 'Muscle Growth Program',
      itemType: 'program',
      createdAt: timestamp(7),
      updatedAt: timestamp(7),
    },
    {
      id: 4,
      userName: 'Marko Dervishi',
      userEmail: 'marko.dervishi@email.com',
      amount: 2500,
      currency: 'all',
      status: 'pending',
      itemName: 'Cardio Endurance',
      itemType: 'program',
      createdAt: timestamp(2),
      updatedAt: timestamp(2),
    },
  ],
  programs: [
    {
      id: 1,
      name: 'Weight Loss Program',
      category: 'Weight Loss',
      description: '12-week structured plan for sustainable fat loss.',
      imageUrl: null,
      videoUrl: null,
      price: 4500,
      currency: 'all',
      polarProductId: null,
      startDate: timestamp(60),
      endDate: null,
      createdAt: timestamp(120),
      updatedAt: timestamp(5),
    },
    {
      id: 2,
      name: 'Muscle Growth Program',
      category: 'Strength',
      description: 'Hypertrophy-focused training with progressive overload.',
      imageUrl: null,
      videoUrl: null,
      price: 5000,
      currency: 'all',
      polarProductId: null,
      startDate: timestamp(90),
      endDate: null,
      createdAt: timestamp(150),
      updatedAt: timestamp(15),
    },
    {
      id: 3,
      name: 'Flexibility & Yoga',
      category: 'Flexibility',
      description: 'Mobility and recovery sessions for all levels.',
      imageUrl: null,
      videoUrl: null,
      price: 3500,
      currency: 'all',
      polarProductId: null,
      startDate: null,
      endDate: null,
      createdAt: timestamp(80),
      updatedAt: timestamp(3),
    },
  ],
  videos: [],
  nextUserId: 4,
  nextTransactionId: 5,
  nextProgramId: 4,
  nextVideoId: 1,
});

const readStore = (): MockStore => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as MockStore;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  const initial = defaultStore();
  writeStore(initial);
  return initial;
};

const writeStore = (store: MockStore) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

const computeStats = (store: MockStore): DashboardStats => {
  const completed = store.transactions.filter((t) => t.status === 'completed');
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return {
    totalUsers: store.users.length,
    totalTransactions: store.transactions.length,
    totalRevenue: completed.reduce((sum, t) => sum + t.amount, 0),
    recentTransactions: store.transactions.filter(
      (t) => new Date(t.createdAt).getTime() >= thirtyDaysAgo
    ).length,
  };
};

const mockResponse = <T,>(data: T) => Promise.resolve({ data: { success: true, data } });

export const isMockAdminEnabled = () =>
  import.meta.env.VITE_USE_MOCK_DATA === 'true' || !import.meta.env.VITE_API_URL;

export const mockAdminApi = {
  getAllUsers: () => mockResponse(readStore().users),
  getAllTransactions: () => mockResponse(readStore().transactions),
  getDashboardStats: () => mockResponse(computeStats(readStore())),
  getAllPrograms: () => mockResponse(readStore().programs),
  createUser: (data: CreateUserData) => {
    const store = readStore();
    const user: AdminUser = {
      id: store.nextUserId,
      email: data.email,
      name: data.name,
      phone: data.phone || null,
      role: data.role || 'member',
      createdAt: timestamp(),
      updatedAt: timestamp(),
      _count: { payments: 0, programs: 0 },
    };
    store.nextUserId += 1;
    store.users.push(user);
    writeStore(store);
    return mockResponse(user);
  },
  createProgram: (data: CreateProgramData) => {
    const store = readStore();
    const program: TrainingProgram = {
      id: store.nextProgramId,
      name: data.name,
      category: data.category,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      videoUrl: data.videoUrl || null,
      price: data.price ?? null,
      currency: data.currency || 'all',
      polarProductId: data.polarProductId || null,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      createdAt: timestamp(),
      updatedAt: timestamp(),
    };
    store.nextProgramId += 1;
    store.programs.push(program);
    writeStore(store);
    return mockResponse(program);
  },
  updateProgram: (id: number, data: Partial<CreateProgramData>) => {
    const store = readStore();
    const index = store.programs.findIndex((p) => p.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Program not found'));
    }
    store.programs[index] = {
      ...store.programs[index],
      ...data,
      description: data.description ?? store.programs[index].description,
      imageUrl: data.imageUrl ?? store.programs[index].imageUrl,
      videoUrl: data.videoUrl ?? store.programs[index].videoUrl,
      price: data.price ?? store.programs[index].price,
      currency: data.currency ?? store.programs[index].currency,
      polarProductId: data.polarProductId ?? store.programs[index].polarProductId,
      startDate: data.startDate ?? store.programs[index].startDate,
      endDate: data.endDate ?? store.programs[index].endDate,
      updatedAt: timestamp(),
    };
    writeStore(store);
    return mockResponse(store.programs[index]);
  },
  deleteProgram: (id: number) => {
    const store = readStore();
    store.programs = store.programs.filter((p) => p.id !== id);
    store.videos = store.videos.filter((v) => v.programId !== id);
    writeStore(store);
    return Promise.resolve({ data: { success: true, message: 'Program deleted' } });
  },
  uploadProgramImage: (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    return Promise.resolve({
      data: {
        success: true,
        data: { imageUrl, filename: file.name },
      },
    });
  },
  getProgramById: (id: number) => {
    const program = readStore().programs.find((p) => p.id === id);
    if (!program) {
      return Promise.reject(new Error('Program not found'));
    }
    return mockResponse(program);
  },
  getProgramVideos: (programId: number) => {
    const videos = readStore().videos.filter((v) => v.programId === programId);
    return mockResponse(videos);
  },
  attachVideo: (programId: number, fileUrl: string, title?: string) => {
    const store = readStore();
    const video: ProgramVideo = {
      id: store.nextVideoId,
      programId,
      url: fileUrl,
      title: title || null,
      createdAt: timestamp(),
    };
    store.nextVideoId += 1;
    store.videos.push(video);
    writeStore(store);
    return mockResponse(video);
  },
  updateVideo: (programId: number, videoId: number, fileUrl: string, title?: string) => {
    const store = readStore();
    const video = store.videos.find((v) => v.id === videoId && v.programId === programId);
    if (!video) {
      return Promise.reject(new Error('Video not found'));
    }
    video.url = fileUrl;
    video.title = title || video.title;
    writeStore(store);
    return mockResponse(video);
  },
  deleteVideo: (programId: number, videoId: number) => {
    const store = readStore();
    store.videos = store.videos.filter((v) => !(v.id === videoId && v.programId === programId));
    writeStore(store);
    return Promise.resolve({ data: { success: true, message: 'Video deleted' } });
  },
};
