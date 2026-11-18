from playwright.sync_api import sync_playwright
import sys
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    pg = b.new_page(viewport={'width':1366,'height':800})
    msgs=[]
    pg.on('console', lambda m: msgs.append(m.type+': '+m.text) if m.type in ('error','warning') else None)
    pg.on('pageerror', lambda e: msgs.append('PAGEERR '+str(e)))
    pg.goto('http://localhost:8777/index.html'); pg.wait_for_timeout(1200)
    pg.screenshot(path='/tmp/s_title.png')
    pg.click('#btn-new'); pg.wait_for_timeout(1500)
    pg.screenshot(path='/tmp/s_start.png')
    def say(t, wait=1200):
        pg.fill('#in', t); pg.press('#in','Enter'); pg.wait_for_timeout(wait)
    say('examine the telegram'); say('go to marlowe house', 1800)
    pg.screenshot(path='/tmp/s_house.png')
    say('interview sir alistair'); say('go to the study', 1500)
    pg.screenshot(path='/tmp/s_study.png')
    say('ask mary gently what she saw on the back stairs')
    pg.screenshot(path='/tmp/s_mary.png')
    pg.click('button[data-open=casebook]'); pg.wait_for_timeout(500)
    pg.screenshot(path='/tmp/s_case.png')
    print('\n'.join(msgs[:15]))
    b.close()
