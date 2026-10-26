import assert from 'node:assert/strict';
import { contactEntries, contactLink } from '../src/lib/contact-links.ts';

assert.equal(contactLink('email', null), null);
assert.equal(contactLink('email', 'operator@example.test'), 'mailto:operator@example.test');
assert.equal(contactLink('email', 'mailto:operator+portfolio@example.test'), 'mailto:operator+portfolio@example.test');
for (const input of ['', 'not an email', 'a@b..test', 'a@-invalid.test', 'a@domain', '.a@example.test', 'a..b@example.test', 'a@example.test?bcc=other@example.test', 'javascript:alert(1)']) assert.equal(contactLink('email', input), null, input);
assert.equal(contactLink('github', 'https://www.github.com/test-user/'), 'https://github.com/test-user');
assert.equal(contactLink('instagram', 'https://instagram.com/test.user/?tracking=ignored'), 'https://instagram.com/test.user');
for (const kind of ['github', 'instagram']) {
  for (const input of [null, '', 'javascript:alert(1)', 'https://example.test/user', 'http://' + kind + '.com/user', 'https://user:pass@' + kind + '.com/user', 'https://' + kind + '.com/', 'https://' + kind + '.com:8443/user', 'https://' + kind + '.com/user/extra', 'https://' + kind + '.com/user name']) assert.equal(contactLink(kind, input), null, `${kind}: ${input}`);
}
assert.ok(contactEntries({ email: null, github: null, instagram: null }).every(entry => !entry.url && !entry.configured));
assert.equal(contactEntries({ email: 'bad', github: null, instagram: null })[0].configured, true);
assert.equal(contactEntries({ email: 'bad', github: null, instagram: null })[0].url, null);
assert.equal(contactEntries({ email: null, github: null, instagram: null }, [{ label: 'GitHub', value: 'test-user', url: 'https://github.com/test-user' }])[1].url, 'https://github.com/test-user');
console.log('PASS: contact channels reject missing/unsafe/wrong-host/invalid addresses; valid email and profile URLs normalize correctly; legacy configured contacts remain supported. Test addresses are never published.');
