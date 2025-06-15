
export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  primaryAction: string;
  secondaryAction: string;
  actionType: 'shop' | 'book' | 'explore';
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HeroSlidesState {
  slides: HeroSlide[];
  loading: boolean;
  error: string | null;
}
