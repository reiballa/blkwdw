import { Component, OnInit } from '@angular/core';
import { SpiderService } from '../services/spider.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-crawls',
  templateUrl: './crawls.component.html',
  styleUrls: ['./crawls.component.scss']
})
export class CrawlsComponent implements OnInit {

  protected spiders: any[];
  protected selectedSpider: any = null;

  protected crawling = false;

  protected text = '';

  constructor(private spiderService: SpiderService, private sockServ :SocketService) { }

  ngOnInit() {
    this.getItems();
    this.sockServ.listen('crawlUpdate').subscribe((update: string) => {
      if (update.startsWith('{')) {
        update = JSON.stringify(JSON.parse(update), null, 4 );
      }
      this.text += '\n' + update;
    });
  }

  handleChanged(event) {
    this.selectedSpider = event.value;
    console.log(event);
  }

  fireTest() {
    if (this.selectedSpider != null) {
      this.crawling = true;
      this.spiderService.startTest(this.selectedSpider).subscribe(res => console.log(res));
    } else {
      console.log('Select a spider');
    }
  }

  fireCrawl() {
    if (this.selectedSpider != null) {
      this.crawling = true;
      this.spiderService.startCrawl(this.selectedSpider).subscribe(res => console.log(res));
    } else {
      console.log('Select a spider');
    }
  }

  updateScroll(){
    let element = document.getElementById('terminal');
    element.scrollTop = element.scrollHeight;
  }

  clearText() {
    this.text = '';
  }

  stopCrawl() {
    if (this.crawling) {
      this.spiderService.stopCrawl().subscribe(res => {
        this.crawling = false;
        this.text += '\n\n' + res;
      })
    }
  }

  getItems() {
    this.spiderService.getSpiders().subscribe((res: any[]) => this.spiders = res);
  }

}
