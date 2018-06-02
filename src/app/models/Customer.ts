export interface Customer {
    _id: string,
    email: string,
    StripeId: string,
    StripeSubscription?: string,
    StripePlan?: string,
    fullName?: string,
    coverImageUrl?: string,
    profileImageUrl?: string,
    bio?: string,
    facebookUrl?: string,
    twitterUrl?: string,
    instagramUrl?: string,
    featured?: boolean,
    resident?: boolean
}