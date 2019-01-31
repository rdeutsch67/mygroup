import { Injectable } from '@angular/core';
import {AppUser} from "@app/interface/appuser";

@Injectable()
export class GlobalVariables {
  bp_isSmScreen : boolean;
  bp_isSmScrPrt: boolean;
  bp_isMidScreen: boolean;
  bp_isWideScreen: boolean;
  bp_isMidOrWideScreen: boolean;

  logged_in_User: AppUser;
}
