// Mock Supabase client for demo purposes
export const supabase = {
  auth: {
    getUser: () => Promise.resolve({ data: { user: null } }),
    signOut: () => Promise.resolve(),
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        limit: (count: number) => Promise.resolve({ data: [], error: null }),
      }),
      order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
    }),
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
  }),
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File) => Promise.resolve({ data: { path }, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: '/mock-avatar.jpg' } }),
    }),
  },
};
