import Google from '@auth/core/providers/google';
import { convexAuth } from '@convex-dev/auth/server';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      if (args.existingUserId) return;
      await ctx.db.patch(args.userId, { status: 'active' });
    },
  },
});
