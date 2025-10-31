// Custom type definitions for the framework

declare global {
  namespace WebdriverIO {
    interface Element {
      // Custom element methods can be added here
    }

    interface Browser {
      // Custom browser methods can be added here
    }
  }

  // Global test utilities
  var expect: Chai.ExpectStatic;
  var assert: Chai.AssertStatic;
  var should: Chai.Should;
}

export {};
