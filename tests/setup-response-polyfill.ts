// Minimal Response polyfill for API route tests
class SimpleResponse {
  private _body: any;
  public status: number;
  constructor(body: any, init?: { status?: number }) {
    this._body = body;
    this.status = init?.status ?? 200;
  }
  async text() {
    return typeof this._body === 'string' ? this._body : JSON.stringify(this._body);
  }
}
// Assign only if not present
// @ts-ignore
if (typeof globalThis.Response === 'undefined') globalThis.Response = SimpleResponse as any;
