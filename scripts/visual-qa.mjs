import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import sharp from 'sharp';
await fs.mkdir('qa',{recursive:true});
const browser=await chromium.launch({headless:true});
const results=[];
for(const width of [1440,1280,1024,768,430,390,375,320]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50))}window.scrollTo(0,0)});
 await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
 await page.screenshot({path:`qa/page-${width}.png`,fullPage:true});
 const layout=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),services:document.querySelectorAll('.service-card').length}));
 results.push({...layout,errors});await page.close();
}
await fs.writeFile('qa/layout-report.json',JSON.stringify(results,null,2));
const reference=await sharp('C:/Users/hp/Downloads/Digital Marketing Website Result-1.png').resize({width:600}).toBuffer();
const actual=await sharp('qa/page-1440.png').resize({width:600}).toBuffer();
const a=await sharp(reference).metadata(),b=await sharp(actual).metadata();
await sharp({create:{width:1200,height:Math.max(a.height,b.height),channels:3,background:'#181818'}}).composite([{input:reference,left:0,top:0},{input:actual,left:600,top:0}]).png().toFile('qa/comparison.png');
await browser.close();console.log(JSON.stringify(results,null,2));
