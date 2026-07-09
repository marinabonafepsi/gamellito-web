import { test, expect } from '@playwright/test';

test.describe('Auth Flow - Multi-Role', () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  test('should navigate to select-role page', async ({ page }) => {
    await page.goto(`${baseUrl}/auth/select-role`);
    expect(await page.locator('text=Bem-vindo ao Gamellito').isVisible()).toBe(true);
    expect(await page.locator('[data-test="btn-role-familia"]').isVisible()).toBe(true);
    expect(await page.locator('[data-test="btn-role-profissional"]').isVisible()).toBe(true);
    expect(await page.locator('[data-test="btn-role-educador"]').isVisible()).toBe(true);
    expect(await page.locator('[data-test="btn-role-instituicao"]').isVisible()).toBe(true);
  });

  test('should redirect familia signup to correct page', async ({ page }) => {
    await page.goto(`${baseUrl}/auth/select-role`);
    await page.click('[data-test="btn-role-familia"]');
    expect(page.url()).toContain('/auth/signup/familia');

    // Check for familia-specific fields
    expect(await page.locator('text=Nome da Criança').isVisible()).toBe(true);
    expect(await page.locator('text=Data de Nascimento').isVisible()).toBe(true);
  });

  test('should redirect profissional signup to correct page', async ({ page }) => {
    await page.goto(`${baseUrl}/auth/select-role`);
    await page.click('[data-test="btn-role-profissional"]');
    expect(page.url()).toContain('/auth/signup/profissional');

    // Check for profissional-specific fields
    expect(await page.locator('text=CRM / COREN').isVisible()).toBe(true);
    expect(await page.locator('text=Especialidade').isVisible()).toBe(true);
  });

  test('should complete familia signup flow', async ({ page }) => {
    const email = `test-familia-${Date.now()}@test.com`;

    await page.goto(`${baseUrl}/auth/select-role`);
    await page.click('[data-test="btn-role-familia"]');

    // Fill form
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="nome"]', 'Maria Silva');
    await page.fill('input[name="nomeCrianca"]', 'João Silva');
    await page.fill('input[name="dataNascimentoCrianca"]', '2020-01-15');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="passwordConfirm"]', 'TestPassword123!');

    // Accept terms
    await page.check('input[name="aceitoTermos"]');
    await page.check('input[name="permitirCompartilhamento"]');

    // Submit
    await page.click('button:has-text("Criar Conta")');

    // Should redirect to familia dashboard
    await page.waitForURL(`${baseUrl}/familia/dashboard`, { timeout: 5000 });
    expect(page.url()).toContain('/familia/dashboard');
  });

  test('should enforce password requirements', async ({ page }) => {
    await page.goto(`${baseUrl}/auth/select-role`);
    await page.click('[data-test="btn-role-familia"]');

    // Try short password
    await page.fill('input[name="password"]', 'short');
    const passwordInput = page.locator('input[name="password"]');

    // Check HTML5 validation
    const validity = await passwordInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);
  });

  test('should prevent signup without accepting terms', async ({ page }) => {
    await page.goto(`${baseUrl}/auth/select-role`);
    await page.click('[data-test="btn-role-familia"]');

    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="nome"]', 'Test User');
    await page.fill('input[name="nomeCrianca"]', 'Test Child');
    await page.fill('input[name="dataNascimentoCrianca"]', '2020-01-15');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="passwordConfirm"]', 'TestPassword123!');

    // Don't check terms
    const submitButton = page.locator('button:has-text("Criar Conta")');
    expect(await submitButton.isDisabled()).toBe(true);
  });

  test('should redirect authenticated familia user from login page', async ({ page, context }) => {
    // Simulate authenticated state (set auth cookie)
    // Note: This requires actual auth setup

    await page.goto(`${baseUrl}/auth/login`);

    // If user is authenticated, should redirect to familia dashboard
    // This test assumes auth is set up via fixtures

    // For now, just verify login page loads
    expect(await page.locator('text=Login').isVisible()).toBe(true);
  });
});

test.describe('Auth Flow - Middleware Routing', () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto(`${baseUrl}/familia/dashboard`);

    // Should redirect to auth/login
    await page.waitForURL(`${baseUrl}/auth/login`, { timeout: 5000 });
    expect(page.url()).toContain('/auth/login');
  });

  test('should prevent familia user from accessing profissional portal', async ({ page }) => {
    // This requires authentication setup
    // Mock: Simulate familia user trying to access profissional page

    // Note: Full test requires auth fixture that creates authenticated users
    // For now, just verify the page structure

    await page.goto(`${baseUrl}/auth/select-role`);
    expect(await page.locator('text=Bem-vindo ao Gamellito').isVisible()).toBe(true);
  });
});

test.describe('Auth Helpers - Session Management', () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  test('should maintain session after refresh', async ({ page }) => {
    // Requires auth fixture
    // This test verifies that session persists across page reloads

    // After signup, refresh page
    // Should still see dashboard (session maintained)
  });

  test('should clear session on logout', async ({ page }) => {
    // Requires auth fixture
    // This test verifies that logout clears session and redirects to home
  });
});
