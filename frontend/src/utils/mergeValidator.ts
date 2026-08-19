/**
 * mergeValidator.ts — Dataset Merge Collision Detection
 *
 * Use this utility BEFORE merging exported JSON datasets from multiple computers.
 * It detects three classes of problems:
 *
 *  1. signer_id COLLISIONS
 *     The same signer_id is associated with two or more distinct display names.
 *     This indicates that two computers happened to produce the same ID for different
 *     people — which should be impossible with UUID-based IDs, but may occur with
 *     legacy sequential IDs (signer_001, signer_002, ...).
 *
 *  2. FEATURE GENERATION MIX
 *     Both 42-feature (legacy: Hello/Yes) and 86-feature (new: two-hand unified)
 *     samples are present in the merged set.
 *     These MUST NOT be combined into a single training dataset.
 *
 *  3. DUPLICATE sample_ids
 *     The exact same sample_id appears in more than one dataset.
 *
 * USAGE EXAMPLE:
 *   import { validateMerge } from "@/utils/mergeValidator";
 *   const report = validateMerge([datasetFromRohan, datasetFromAmit]);
 *   if (!report.isClean) { console.error(report); }
 */

import { SampleMetadata } from "./storage";

/** A signer_id that maps to more than one display name across the merged datasets. */
export interface SignerConflict {
  signer_id: string;
  names: string[];
}

/** Full merge validation report. */
export interface MergeReport {
  /** Total number of samples across all input datasets. */
  totalSamples: number;

  /**
   * signer_ids that appear with more than one distinct display name.
   * Empty array = no collisions detected.
   */
  signerConflicts: SignerConflict[];

  /**
   * True if both 42-feature (legacy) and 86-feature (new) samples are present.
   * THESE MUST NOT be combined into one training dataset.
   */
  generationMixWarning: boolean;

  /**
   * sample_ids that appear more than once across all input datasets.
   * Empty array = no duplicates detected.
   */
  duplicateSampleIds: string[];

  /**
   * True only when all three checks pass. A clean merge is safe to proceed with.
   */
  isClean: boolean;
}

/**
 * Validates a set of exported datasets for merge safety.
 *
 * @param datasets  One entry per exported JSON file, each already JSON.parse'd.
 * @returns         A MergeReport summarising all detected issues.
 */
export function validateMerge(datasets: SampleMetadata[][]): MergeReport {
  const allSamples = datasets.flat();
  const totalSamples = allSamples.length;

  // 1. Detect signer_id -> name conflicts
  const signerNames = new Map<string, Set<string>>();
  for (const sample of allSamples) {
    const id = sample.signer_id;
    const name = sample.signer_name ?? "(unnamed)";
    if (!signerNames.has(id)) signerNames.set(id, new Set());
    signerNames.get(id)!.add(name);
  }
  const signerConflicts: SignerConflict[] = [];
  for (const [id, names] of signerNames) {
    if (names.size > 1) signerConflicts.push({ signer_id: id, names: [...names] });
  }

  // 2. Detect feature generation mix (42 vs 86)
  const dims = new Set(allSamples.map(s => s.feature_dimension));
  const generationMixWarning = dims.has(42) && dims.has(86);

  // 3. Detect duplicate sample_ids
  const sampleIdCounts = new Map<string, number>();
  for (const sample of allSamples) {
    sampleIdCounts.set(sample.sample_id, (sampleIdCounts.get(sample.sample_id) ?? 0) + 1);
  }
  const duplicateSampleIds: string[] = [];
  for (const [id, count] of sampleIdCounts) {
    if (count > 1) duplicateSampleIds.push(id);
  }

  const isClean =
    signerConflicts.length === 0 &&
    !generationMixWarning &&
    duplicateSampleIds.length === 0;

  return { totalSamples, signerConflicts, generationMixWarning, duplicateSampleIds, isClean };
}
