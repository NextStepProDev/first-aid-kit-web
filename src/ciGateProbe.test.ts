import { describe, it, expect } from 'vitest'

describe('ci gate probe', () => {
  it('fails on purpose', () => {
    expect(1).toBe(2)
  })
})
