import { Injectable } from '@angular/core';
import { EditorFeatureMap } from './feature.map';

@Injectable()
export class FeatureService {
  private featureMap = EditorFeatureMap;

  constructor() {}

  hasFeature(language: string, feature: string) {
    return this.featureMap[language][feature];
  }
}