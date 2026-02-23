import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { expect } from "bun:test";
import * as matchers from "@testing-library/jest-dom/matchers";

// Better Auth client needs a valid base URL in test environment
process.env.BETTER_AUTH_URL ??= "http://localhost:3000";

GlobalRegistrator.register();
expect.extend(matchers);
