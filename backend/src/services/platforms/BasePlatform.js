/**
 * Abstract Base Platform Class for expandable contest platform providers.
 * Any new platform (e.g. AtCoder, HackerRank, GeeksforGeeks) can extend this class.
 */
export class BasePlatform {
  constructor({ id, name, color, badgeBg, website, availableDivisions = [] }) {
    if (!id || !name) {
      throw new Error('Platform must have an id and name');
    }
    this.id = id;
    this.name = name;
    this.color = color || '#6366f1';
    this.badgeBg = badgeBg || 'rgba(99, 102, 241, 0.15)';
    this.website = website || '';
    this.availableDivisions = availableDivisions;
  }

  getMetadata() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      badgeBg: this.badgeBg,
      website: this.website,
      availableDivisions: this.availableDivisions
    };
  }

  /**
   * Must be implemented by child classes.
   * @returns {Promise<Array<NormalizedContest>>}
   */
  async fetchContests() {
    throw new Error(`fetchContests() not implemented for platform: ${this.id}`);
  }

  /**
   * Helper to determine contest status based on start and end time.
   */
  determineStatus(startTimeMs, endTimeMs) {
    const now = Date.now();
    if (now < startTimeMs) return 'UPCOMING';
    if (now >= startTimeMs && now <= endTimeMs) return 'LIVE';
    return 'PAST';
  }

  /**
   * Helper to format standardized contest object
   */
  createContest({
    id,
    title,
    url,
    startTimeMs,
    durationSeconds,
    divisions = ['All'],
    type = 'Standard',
    description = ''
  }) {
    const endTimeMs = startTimeMs + (durationSeconds * 1000);
    const status = this.determineStatus(startTimeMs, endTimeMs);

    return {
      id: `${this.id}-${id}`,
      originalId: String(id),
      platform: this.id,
      platformName: this.name,
      platformColor: this.color,
      platformBadgeBg: this.badgeBg,
      title: title.trim(),
      url: url || this.website,
      startTime: new Date(startTimeMs).toISOString(),
      endTime: new Date(endTimeMs).toISOString(),
      startTimeMs,
      endTimeMs,
      durationSeconds,
      status, // 'UPCOMING' | 'LIVE' | 'PAST'
      divisions: divisions.length ? divisions : ['All'],
      type,
      description
    };
  }
}
