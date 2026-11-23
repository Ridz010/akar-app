export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type Timestamps = { created_at: string }

type ProfileRow = Timestamps & {
  id: string
  full_name: string
  role: Database['public']['Enums']['user_role']
  group_id: string | null
  show_name_publicly: boolean
  updated_at: string
}

type ConservationGroupRow = Timestamps & {
  id: string
  name: string
  region: string | null
}

type SpeciesRow = Timestamps & {
  id: string
  scientific_name: string
  local_name: string | null
  family: string | null
  leaf_traits: string | null
  model_label: string | null
  is_supported: boolean
}

type LocationRow = Timestamps & {
  id: string
  name: string
  latitude: number
  longitude: number
  is_sensitive: boolean
  group_id: string | null
  created_by: string | null
}

type ObservationRow = Timestamps & {
  id: string
  user_id: string
  location_id: string | null
  latitude: number
  longitude: number
  observed_at: string
  photo_path: string
  condition: Database['public']['Enums']['site_condition']
  notes: string | null
  species_id: string | null
  status: Database['public']['Enums']['observation_status']
  updated_at: string
}

type PredictionRow = Timestamps & {
  id: string
  user_id: string
  observation_id: string | null
  photo_path: string
  prediction_status: Database['public']['Enums']['prediction_status']
  predicted_label: string | null
  species_id: string | null
  confidence: number
  top_k: Json
  model_version: string
  observed_traits: string[]
  photo_quality: 'good' | 'fair' | 'poor' | null
  photo_feedback: string | null
  agreement: number | null
}

type VerificationRow = Timestamps & {
  id: string
  observation_id: string
  verifier_id: string
  decision: Database['public']['Enums']['observation_status']
  species_id: string | null
  note: string | null
}

type ActivityRow = Timestamps & {
  id: string
  title: string
  description: string | null
  location_id: string | null
  group_id: string | null
  source_observation_id: string | null
  starts_at: string
  ends_at: string | null
  status: Database['public']['Enums']['activity_status']
  created_by: string | null
}

type ActivityParticipantRow = {
  activity_id: string
  user_id: string
  joined_at: string
}

type ArticleRow = Timestamps & {
  id: string
  slug: string
  title: string
  summary: string
  body: string
  cover_path: string | null
  author_id: string | null
  published_at: string | null
  updated_at: string
}

type Generated = 'id' | 'created_at' | 'updated_at'

type Insertable<Row, Optional extends keyof Row = never> = Omit<Row, Generated | Optional> &
  Partial<Pick<Row, Extract<Generated, keyof Row> | Optional>>

type Table<Row, Optional extends keyof Row = never, Relationships extends unknown[] = []> = {
  Row: Row
  Insert: Insertable<Row, Optional>
  Update: Partial<Row>
  Relationships: Relationships
}

type Relation<Column extends string, Referenced extends string> = {
  foreignKeyName: `${string}_${Column}_fkey`
  columns: [Column]
  isOneToOne: false
  referencedRelation: Referenced
  referencedColumns: ['id']
}

export type Database = {
  public: {
    Tables: {
      conservation_groups: Table<ConservationGroupRow, 'region'>
      profiles: Table<
        ProfileRow,
        'full_name' | 'role' | 'group_id' | 'show_name_publicly',
        [Relation<'group_id', 'conservation_groups'>]
      >
      species: Table<
        SpeciesRow,
        'local_name' | 'family' | 'leaf_traits' | 'model_label' | 'is_supported'
      >
      locations: Table<
        LocationRow,
        'is_sensitive' | 'group_id' | 'created_by',
        [Relation<'group_id', 'conservation_groups'>, Relation<'created_by', 'profiles'>]
      >
      observations: Table<
        ObservationRow,
        'location_id' | 'notes' | 'species_id' | 'status',
        [
          Relation<'user_id', 'profiles'>,
          Relation<'location_id', 'locations'>,
          Relation<'species_id', 'species'>,
        ]
      >
      predictions: Table<
        PredictionRow,
        | 'observation_id'
        | 'predicted_label'
        | 'species_id'
        | 'top_k'
        | 'observed_traits'
        | 'photo_quality'
        | 'photo_feedback'
        | 'agreement',
        [
          Relation<'user_id', 'profiles'>,
          Relation<'observation_id', 'observations'>,
          Relation<'species_id', 'species'>,
        ]
      >
      verifications: Table<
        VerificationRow,
        'species_id' | 'note',
        [
          Relation<'observation_id', 'observations'>,
          Relation<'verifier_id', 'profiles'>,
          Relation<'species_id', 'species'>,
        ]
      >
      activities: Table<
        ActivityRow,
        | 'description'
        | 'location_id'
        | 'group_id'
        | 'source_observation_id'
        | 'ends_at'
        | 'status'
        | 'created_by',
        [Relation<'location_id', 'locations'>, Relation<'group_id', 'conservation_groups'>]
      >
      activity_participants: Table<
        ActivityParticipantRow,
        'joined_at',
        [Relation<'activity_id', 'activities'>, Relation<'user_id', 'profiles'>]
      >
      articles: Table<ArticleRow, 'cover_path' | 'author_id' | 'published_at'>
    }
    Views: {
      public_map_points: {
        Row: {
          id: string
          latitude: number
          longitude: number
          is_approximate: boolean
          condition: Database['public']['Enums']['site_condition']
          observed_at: string
          scientific_name: string | null
          local_name: string | null
          location_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      current_user_role: {
        Args: Record<string, never>
        Returns: Database['public']['Enums']['user_role']
      }
      is_verifier: { Args: Record<string, never>; Returns: boolean }
      is_admin: { Args: Record<string, never>; Returns: boolean }
    }
    Enums: {
      user_role: 'community' | 'coordinator' | 'admin'
      observation_status: 'pending' | 'verified' | 'revision_required' | 'rejected'
      prediction_status: 'confident' | 'needs_review' | 'unrecognized'
      site_condition: 'healthy' | 'stressed' | 'damaged' | 'littered'
      activity_status: 'planned' | 'ongoing' | 'completed' | 'cancelled'
    }
    CompositeTypes: Record<string, never>
  }
}

type PublicSchema = Database['public']

export type Tables<Name extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][Name]['Row']
export type TablesInsert<Name extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][Name]['Insert']
export type Views<Name extends keyof PublicSchema['Views']> = PublicSchema['Views'][Name]['Row']
export type Enums<Name extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][Name]
